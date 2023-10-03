require("hardhat-circom");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.6.11",
      },
      {
        version: "0.8.9",
      },
    ],
  },
  circom: {
    inputBasePath: "./circuits",
    ptau: "https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_15.ptau",
    circuits: [
      {
        name: "nft",
        // No protocol, so it defaults to groth16
      },
      {
        name: "acceptableMarginOfError",
        // No protocol, so it defaults to groth16
      },
      {
        name: "detectCollisionMain",
        // No protocol, so it defaults to groth16
      },
      {
        name: "stepStateMain",
        // No protocol, so it defaults to groth16
      },
      {
        name: "getDistanceMain",
        // No protocol, so it defaults to groth16
      },
      {
        name: "calculateForceMain",
        // No protocol, so it defaults to groth16
      },
      {
        name: "forceAccumulatorMain",
        // No protocol, so it defaults to groth16
      },
      {
        name: "absoluteValueSubtraction",
        // No protocol, so it defaults to groth16
      },
      {
        name: "division",
        // No protocol, so it defaults to groth16
      },
      {
        name: "simple-polynomial",
        // Generate PLONK
        protocol: "plonk",
      },
      {
        name: "hash",
        // Explicitly generate groth16
        protocol: "groth16",
      },
    ],
  },
};
