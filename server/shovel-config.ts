import { makeConfig, toJSON } from '@indexsupply/shovel-config'
import type {
  Source,
  Table,
  Integration,
  PGColumnType
} from '@indexsupply/shovel-config'
import { Problems, Bodies, Solver } from './src/contracts'
import { ethers } from 'ethers'
import { camelToSnakeCase } from './src/util'

const mainnet: Source = {
  name: 'mainnet',
  chain_id: 1,
  url: 'https://ethereum-rpc.publicnode.com'
}

const sepolia: Source = {
  name: 'sepolia',
  chain_id: 11155111,
  url: 'https://rpc2.sepolia.org',
  batch_size: 1000,
  concurrency: 1
}

const garnet: Source = {
  name: 'garnet',
  chain_id: 17069,
  url: 'https://rpc.garnetchain.com',
  batch_size: 1000,
  concurrency: 1
}

const solTypeToPgType: Record<string, PGColumnType> = {
  address: 'bytea',
  uint256: 'numeric',
  bytes32: 'bytea',
  int: 'int',
  bool: 'bool'
}

const STARTING_BLOCK = {
  // mainnet: BigInt('2067803')
  sepolia: BigInt('5716600'),
  garnet: BigInt('2067803')
}

export type Chain = 'mainnet' | 'sepolia' | 'garnet'

export const sources = [sepolia, garnet]

const contracts = Object.fromEntries(
  [Problems, Bodies, Solver].map((contract) => {
    const abi = contract.abi.abi
    return [
      contract.abi.contractName,
      sources.map(
        (s) => new ethers.Contract(contract.networks[s.chain_id].address, abi)
      )
    ]
  })
)

async function integrationFor(
  contractName: string,
  eventName: string
): Promise<Integration> {
  const tableName = camelToSnakeCase(`${contractName}_${eventName}`)

  const contract = contracts[contractName]
  console.assert(contract, `Contract ${contractName} not found`)
  const event = contract[0].interface.getEvent(eventName)
  console.assert(
    event,
    `Event ${eventName} not found in contract ${contractName}`
  )
  const columns = event.inputs
    .map((input) => {
      const pgType = solTypeToPgType[input.type as keyof typeof solTypeToPgType]
      console.assert(pgType, `Unsupported type ${input.type}`)
      return {
        name: camelToSnakeCase(input.name),
        type: pgType,
        indexed: input.indexed
      }
    })
    .concat([
      {
        name: 'log_addr',
        type: 'bytea',
        indexed: true
      }
    ])

  const table: Table = {
    name: tableName,
    columns
  }

  const inputs = event.inputs.map((input) => {
    return {
      name: input.name,
      type: input.type,
      indexed: input.indexed,
      column: camelToSnakeCase(input.name)
    }
  })

  return {
    enabled: true,
    name: tableName,
    sources: sources.map((s) => ({
      name: s.name,
      start: STARTING_BLOCK[s.name]
    })),
    table,
    block: [
      {
        name: 'log_addr',
        column: 'log_addr',
        filter_op: 'contains',
        filter_arg: (await Promise.all(
          contract.map((c) => c.getAddress())
        )) as any[]
      }
    ],
    event: {
      type: 'event',
      name: eventName,
      anonymous: false,
      inputs
    },
    notification: {
      columns: ['log_addr']
    }
  }
}

if (process.env.OUTPUT) {
  ;(async () => {
    let integrations = await Promise.all([
      integrationFor('Problems', 'Transfer'),
      integrationFor('Bodies', 'Transfer'),
      integrationFor('Solver', 'Solved'),
      integrationFor('Bodies', 'bodyBorn'),
      integrationFor('Problems', 'bodyAdded'),
      integrationFor('Problems', 'bodyRemoved')
    ])

    const config = makeConfig({
      pg_url: '$DATABASE_URL',
      sources,
      integrations: integrations
    })

    console.log(toJSON(config))
  })()
}
