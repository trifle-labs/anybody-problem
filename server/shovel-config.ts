import { makeConfig, toJSON } from '@indexsupply/shovel-config'
import type { Source, Table, Integration } from '@indexsupply/shovel-config'
import {
  Problems,
  Bodies,
  Solver,
  ProblemMetadata,
  BodyMetadata
} from './contracts'
import { ethers } from 'ethers'

const mainnet: Source = {
  name: 'mainnet',
  chain_id: 1,
  url: 'https://ethereum-rpc.publicnode.com'
}

const sepolia: Source = {
  name: 'sepolia',
  chain_id: 11155111,
  url: 'https://rpc2.sepolia.org', // 'https://ethereum-sepolia-rpc.publicnode.com' rate limited
  batch_size: 1000,
  concurrency: 1
}

const network = sepolia.chain_id
const contracts = Object.fromEntries(
  [Problems, Bodies, Solver, ProblemMetadata, BodyMetadata].map((contract) => {
    const abi = contract.abi.abi
    return [
      contract.abi.contractName,
      new ethers.Contract(contract.networks[network].address, abi)
    ]
  })
)

const solTypeToPgType = {
  address: 'bytea',
  uint256: 'numeric',
  bytes32: 'bytea',
  int: 'int',
  bool: 'bool'
}

function camelToSnakeCase(str: string) {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

async function integrationFor(
  contractName: string,
  eventName: string,
  tableName: string
): Promise<Integration> {
  const contract = contracts[contractName]
  console.assert(contract, `Contract ${contractName} not found`)
  const event = contract.interface.getEvent(eventName)
  console.assert(
    event,
    `Event ${eventName} not found in contract ${contractName}`
  )
  const columns = event.inputs
    .map((input) => {
      const pgType = solTypeToPgType[input.type]
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
    sources: [{ name: sepolia.name, start: BigInt('5716604') }], // 5716604 is the block number of the Solver contract deployment
    table,
    block: [
      {
        name: 'log_addr',
        column: 'log_addr',
        filter_op: 'contains',
        filter_arg: [(await contract.getAddress()) as any]
      }
    ],
    event: {
      type: 'event',
      name: eventName,
      anonymous: false,
      inputs
    }
  }
}

;(async () => {
  let integrations = await Promise.all([
    integrationFor('Problems', 'Transfer', 'problems_transfer'),
    integrationFor('Bodies', 'Transfer', 'bodies_transfer'),
    integrationFor('Solver', 'Solved', 'solver_solved'),
    integrationFor('Bodies', 'bodyBorn', 'bodies_body_born'),
    integrationFor('Problems', 'bodyAdded', 'problems_body_added'),
    integrationFor('Problems', 'bodyRemoved', 'problems_body_removed')
  ])

  const config = makeConfig({
    pg_url: 'postgres:///shovel',
    sources: [sepolia],
    integrations: integrations
  })

  console.log(toJSON(config))
})()
