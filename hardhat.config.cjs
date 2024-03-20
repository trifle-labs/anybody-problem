require('hardhat-circom')
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
      chainId: 12345,
      loggingEnabled: false
    },
    formatest: {
      // url: 'https://sepolia.infura.io/v3/' + process.env.INFURA_API_KEY,
      url: 'https://rpc.sketchpad-1.forma.art/',
      accounts: { mnemonic: process.env.deploymentKey },
      gasPrice: 1_000_000_000 // 1 GWEI
    },
    sepolia: {
      url: 'https://sepolia.rpc.grove.city/v1/' + process.env.grove,
      accounts: { mnemonic: process.env.deploymentKey },
      gasPrice: 10_000_000_000 // 10 GWEI
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
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: process.env.etherscanApiNew
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: true,
    runOnCompile: true,
    strict: true
  },
  circom: {
    inputBasePath: './circuits',
    ptau: 'https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_20.ptau',
    circuits: [
      {
        name: 'absoluteValueSubtraction'
        // No protocol, so it defaults to groth16
      },
      {
        name: 'acceptableMarginOfError'
        // No protocol, so it defaults to groth16
      },
      {
        name: 'calculateForceMain'
        // No protocol, so it defaults to groth16
      },
      {
        name: 'detectCollisionMain'
        // No protocol, so it defaults to groth16
      },
      {
        name: 'forceAccumulatorMain'
        // No protocol, so it defaults to groth16
      },
      {
        name: 'getDistanceMain'
        // No protocol, so it defaults to groth16
      },
      {
        name: 'limiterMain'
        // No protocol, so it defaults to groth16
      },
      {
        name: 'lowerLimiterMain'
        // No protocol, so it defaults to groth16
      },
      {
        name: 'nftTest'
        // No protocol, so it defaults to groth16
      },
      {
        name: 'nftProd'
        // No protocol, so it defaults to groth16
      },
      {
        name: 'stepStateTest'
        // No protocol, so it defaults to groth16
      }
      // {
      //   name: "division",
      //   // No protocol, so it defaults to groth16
      // },
      // {
      //   name: "simple-polynomial",
      //   // Generate PLONK
      //   protocol: "plonk",
      // },
      // {
      //   name: "hash",
      //   // Explicitly generate groth16
      //   protocol: "groth16",
      // },
    ]
  }
}

for (let i = 3; i <= 10; i++) {
  config.circom.circuits.push({
    name: `nft_${i}_20`
    // No protocol, so it defaults to groth16
  })
}

module.exports = config
