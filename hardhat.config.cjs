require('@nomiclabs/hardhat-waffle')
require('hardhat-gas-reporter')
require('hardhat-contract-sizer')
require('dotenv').config()
require('@nomicfoundation/hardhat-verify')
require('solidity-coverage')

// const { subtask } = require('hardhat/config')
// const {
//   TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS
// } = require('hardhat/builtin-tasks/task-names')

// Add a subtask that sets the action for the TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS task

//eslint-disable-next-line
// subtask(TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS).setAction(
//   async (_, __, runSuper) => {
//     // Get the list of source paths that would normally be passed to the Solidity compiler
//     const paths = await runSuper()
//     // Apply a filter function to exclude paths that contain the string "ignore"
//     let val = paths.filter((p) => !p.includes('Assets') && !p.includes('Game'))
//     // console.log(val)
//     return val
//   }
// )

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const config = {
  mocha: {
    timeout: 100_000_000
  },
  solidity: {
    compilers: [
      {
        version: '0.6.11'
      },
      {
        version: '0.8.15',
        settings: {
          viaIR: true,
          optimizer: { enabled: true, runs: 200 }
        }
      }
    ]
  },
  networks: {
    hardhat: {
      accounts: { mnemonic: process.env.deploymentKey },
      gasPrice: 1_000_000_000,
      blockGasLimit: 20_000_000,
      chainId: 12345
      // loggingEnabled: false
    },
    formatest: {
      // url: 'https://sepolia.infura.io/v3/' + process.env.INFURA_API_KEY,
      url: 'https://rpc.sketchpad-1.forma.art/',
      accounts: { mnemonic: process.env.deploymentKey },
      gasPrice: 1_000_000_000 // 1 GWEI
    },
    baseSepolia: {
      // network ID: 84532
      // url: 'https://sepolia.base.org',
      url: process.env.baseSepoliaRPC,
      accounts: { mnemonic: process.env.deploymentKey },
      gas: 5_000_000,
      gasPrice: 100_000_000 // 0.1 GWEI
    },
    base: {
      // network ID: 84532
      // url: 'https://sepolia.base.org',
      url: process.env.baseRPC,
      accounts: { mnemonic: process.env.deploymentKey, initialIndex: 0 },
      // gas: 5_000_000,
      gasPrice: 10_000_000 // 0.01 GWEI
    },
    sepolia: {
      // url: 'https://sepolia.infura.io/v3/' + process.env.INFURA_API_KEY,
      // url: 'https://sepolia.rpc.grove.city/v1/' + process.env.grove,
      url: 'https://ethereum-sepolia.blockpi.network/v1/rpc/public',
      accounts: { mnemonic: process.env.deploymentKey },
      gasPrice: 15_000_000_000, // 10 GWEI
      gas: 10_000_000
    },
    garnet: {
      url: 'https://rpc.garnetchain.com',
      accounts: { mnemonic: process.env.localKey },
      gasPrice: 10_000_000 // 0.01 GWEI
    }
  },
  gasReporter: {
    currency: 'USD',
    gasPrice: 0.1,
    url: 'http://localhost:8545',
    coinmarketcap: '38b60711-0559-45f4-8bda-e72f446c8278',
    enabled: true,
    showMethodSig: true
  },
  sourcify: {
    enabled: false
  },
  etherscan: {
    apiKey: {
      mainnet: process.env.etherscanApiNew,
      sepolia: process.env.etherscanApiNew,
      base: process.env.etherscanApiBase,
      baseSepolia: process.env.etherscanApiBase
    },

    customChains: [
      {
        network: 'garnet',
        chainId: 17069,
        urls: {
          apiURL: 'https://explorer.garnetchain.com/api/',
          browserURL: 'https://explorer.garnetchain.com'
        }
      }
      // {
      //   network: 'baseSepolia',
      //   chainId: 84532,

      //   urls: {
      //     apiURL: 'https://api-sepolia.basescan.org/api',
      //     browserURL: 'https://sepolia.basescan.org'
      //   }
      // }
    ]
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: false,
    only: [
      'AnybodyProblem',
      'Speedruns',
      'ExternalMetadata',
      'Assets1',
      'Assets2',
      'Assets3',
      'Assets4',
      'Assets5'
    ]
  }
}
module.exports = config
