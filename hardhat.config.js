require("hardhat-circom");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("hardhat-contract-sizer");
require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");


/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  mocha: {
    timeout: 100_000_000
  },
  solidity: {
    compilers: [
      {
        version: "0.6.11",
      },
      {
        version: "0.8.15",
        settings: {
          viaIR: false,
          optimizer: { enabled: true, runs: 200 },
        },
      },
    ],
  },
  networks: {
    hardhat: {
      gasPrice: 10_000_000_000,
      blockGasLimit: 30_000_000,
      chainId: 12345,
      // loggingEnabled: true
    },
  },
  gasReporter: {
    currency: "EUR",
    gasPrice: 42,
    url: "http://localhost:8545",
    coinmarketcap: "38b60711-0559-45f4-8bda-e72f446c8278",
    enabled: true,
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: process.env.etherscanApiNew,
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: true,
    runOnCompile: true,
    strict: true,
  },
  circom: {
    inputBasePath: "./circuits",
    ptau: "https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_20.ptau",
    circuits: [
      {
        name: "absoluteValueSubtraction",
        // No protocol, so it defaults to groth16
      },
      {
        name: "acceptableMarginOfError",
        // No protocol, so it defaults to groth16
      },
      {
        name: "calculateForceMain",
        // No protocol, so it defaults to groth16
      },
      {
        name: "detectCollisionMain",
        // No protocol, so it defaults to groth16
      },
      {
        name: "forceAccumulatorMain",
        // No protocol, so it defaults to groth16
      },
      {
        name: "getDistanceMain",
        // No protocol, so it defaults to groth16
      },
      {
        name: "limiterMain",
        // No protocol, so it defaults to groth16
      },
      {
        name: "lowerLimiterMain",
        // No protocol, so it defaults to groth16
      },
      {
        name: "nft",
        // No protocol, so it defaults to groth16
      },
      {
        name: "stepStateMain",
        // No protocol, so it defaults to groth16
      },
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
    ],
  },
};
