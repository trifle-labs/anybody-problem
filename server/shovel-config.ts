import { makeConfig, toJSON } from '@indexsupply/shovel-config'
import type {
  Source,
  Table,
  Integration,
  PGColumnType,
  IndexStatment
} from '@indexsupply/shovel-config'
import { AnybodyProblem, Speedruns } from './contracts'
import { ethers } from 'ethers'
import { camelToSnakeCase } from './src/util'

export type Chain = 'mainnet' | 'sepolia' | 'garnet' | 'base_sepolia'
type KnownSource = Source & { name: Chain }

const mainnet: KnownSource = {
  name: 'mainnet',
  chain_id: 1,
  url: process.env.MAINNET_RPC
}

const sepolia: KnownSource = {
  name: 'sepolia',
  chain_id: 11155111,
  url: process.env.SEPOLIA_RPC,
  batch_size: 1000,
  concurrency: 1
}

const garnet: KnownSource = {
  name: 'garnet',
  chain_id: 17069,
  url: process.env.GARNET_RPC,
  batch_size: 1000,
  concurrency: 1
}

const baseSepolia: KnownSource = {
  name: 'base_sepolia',
  chain_id: 84532,
  url: process.env.BASE_SEPOLIA_RPC,
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
  garnet: BigInt('2067803'),
  base_sepolia: BigInt('11476234')
}

// n.b. sources must match ABI in contracts to correctly sync
export const sources: KnownSource[] = [baseSepolia]

const contracts = Object.fromEntries(
  [AnybodyProblem, Speedruns].map((contract) => {
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
  eventName: string,
  index: IndexStatment[] = []
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
    columns,
    index
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
  ;(async function main() {
    let integrations = await Promise.all([
      integrationFor('Speedruns', 'Transfer', [
        ['block_num DESC', 'tx_idx DESC', 'log_idx DESC']
      ]),
      integrationFor('AnybodyProblem', 'RunCreated'),
      integrationFor('AnybodyProblem', 'RunSolved', [
        ['accumulative_time ASC']
      ]),
      integrationFor('AnybodyProblem', 'LevelCreated'),
      integrationFor('AnybodyProblem', 'LevelSolved', [['time ASC']])
    ])

    const config = makeConfig({
      pg_url: '$DATABASE_URL',
      sources,
      integrations: integrations
    })

    console.log(toJSON(config))
  })()
}
