require('@nomiclabs/hardhat-waffle')
require('hardhat-gas-reporter')
require('hardhat-contract-sizer')
require('dotenv').config()
require('@nomiclabs/hardhat-etherscan')
require('solidity-coverage')

// const util = require("util");

// // Import necessary modules
// const { task } = require("hardhat/config");

// // Define a new task or extend the existing 'test' task
// task("test", "Runs custom commands before tests", async (taskArgs, hre, runSuper) => {
//   console.log({ taskArgs })
//   // Your custom command or function call
//   console.log("Running custom circom command before tests...");

//   const exec = util.promisify(require("child_process").exec);

//   if (taskArgs.testFiles.length == 0) {

//   }

//   try {
//     let resp
//     resp = await exec("'./utils/1_create_wasm.sh' nft");
//     console.log(resp.stdout)
//     resp = await exec("'./utils/2_create_zkey.sh' nft");
//     console.log(resp.stdout)
//     resp = await exec("'./utils/5_create_solidity.sh' nft");
//     console.log(resp.stdout)
//   } catch (error) {
//     console.error(`Error executing the commands: ${error}`);
//   }
//   // Then run the original test task
//   await runSuper(taskArgs);
// });

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
      gasPrice: 10_000_000_000,
      blockGasLimit: 30_000_000,
      chainId: 12345
      // loggingEnabled: false
    },
    formatest: {
      // url: 'https://sepolia.infura.io/v3/' + process.env.INFURA_API_KEY,
      url: 'https://rpc.sketchpad-1.forma.art/',
      accounts: { mnemonic: process.env.deploymentKey },
      gasPrice: 1_000_000_000 // 1 GWEI
    },
    sepolia: {
      // url: 'https://sepolia.infura.io/v3/' + process.env.INFURA_API_KEY,
      // url: 'https://sepolia.rpc.grove.city/v1/' + process.env.grove,
      url: 'https://ethereum-sepolia.blockpi.network/v1/rpc/public',
      accounts: { mnemonic: process.env.deploymentKey },
      gasPrice: 150_000_000_000, // 150 GWEI
      gas: 12_000_000
    },
    garnet: {
      url: 'https://rpc.garnetchain.com	',
      accounts: { mnemonic: process.env.deploymentKey },
      gasPrice: 10_000_000 // 0.01 GWEI
    }
  },
  gasReporter: {
    currency: 'EUR',
    gasPrice: 42,
    url: 'http://localhost:8545',
    coinmarketcap: '38b60711-0559-45f4-8bda-e72f446c8278',
    enabled: true
  },
  etherscan: {
    apiKey: process.env.etherscanApiNew,
    customChains: [
      {
        network: 'garnet',
        chainId: 17069,
        urls: {
          apiURL: 'https://explorer.garnetchain.com/api/',
          browserURL: 'https://explorer.garnetchain.com'
        }
      }
    ]
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: true,
    runOnCompile: true,
    strict: true
  }
}
module.exports = config
