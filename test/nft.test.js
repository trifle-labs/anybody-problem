

const hre = require("hardhat");
const { ethers } = require("hardhat");
const { exportCallDataGroth16 } = require("../utils/utils");
const { mine } = require("@nomicfoundation/hardhat-network-helpers");

const { assert, expect } = require("chai");
const {
  calculateTime,
  convertScaledStringArrayToBody,
  convertScaledBigIntBodyToArray,
  forceAccumulatorBigInts
} = require("../docs/index.js");


const p = 21888242871839275222246405745257275088548364400416034343698204186575808495617n;
const steps = 617;



describe("nft circuit", () => {
  let circuit;
  // NOTE: velocities are offset by 10_000 to avoid negative numbers
  const sampleInput = {
    bodies: [
      ["226000", "42000", "8670", "3710", "100000"],
      ["363000", "658000", "6680", "13740", "75000"],
      ["679000", "500000", "12290", "12520", "50000"]
    ]
  };
  const sanityCheck = true;




  before(async () => {
    circuit = await hre.circuitTest.setup("nft");
  });

  it.only("produces a witness with valid constraints", async () => {
    const witness = await circuit.calculateWitness(sampleInput, sanityCheck);
    const inputs = sampleInput.bodies.length * sampleInput.bodies[0].length
    const perStep = witness.length - inputs
    const secRounded = calculateTime(perStep, steps)
    console.log(`| nft(3, ${steps}) | ${perStep} | ${secRounded} |`)
    await circuit.checkConstraints(witness);
  });

  it("has expected witness values", async () => {
    const witness = await circuit.calculateLabeledWitness(
      sampleInput,
      sanityCheck
    );
    console.log({ witness })

    // assert.propertyVal(witness, "main.squared", sampleInput.squared);
    // assert.propertyVal(witness, "main.calculatedRoot", sampleInput.calculatedRoot);
    // assert.propertyVal(witness, "main.calculatedSquared", (sampleInput.calculatedRoot ** 2).toString())
    // assert.propertyVal(witness, "main.out", "1");
  });

  it("has the correct output", async () => {
    let bodies = sampleInput.bodies.map(convertScaledStringArrayToBody)
    // console.dir({ bodies }, { depth: null })
    for (let i = 0; i < steps; i++) {
      bodies = forceAccumulatorBigInts(bodies)
    }
    const out_bodies = bodies.map(convertScaledBigIntBodyToArray)
    // console.log({ out_bodies })
    const expected = { out_bodies };
    const witness = await circuit.calculateWitness(sampleInput, sanityCheck);
    await circuit.assertOut(witness, expected);
  });

  it("NftVerifier.sol works", async () => {
    const NftVerifier = await ethers.getContractFactory("contracts/NftVerifier.sol:Verifier");
    const nftVerifier = await NftVerifier.deploy();
    await nftVerifier.deployed();

    let dataResult = await exportCallDataGroth16(
      sampleInput,
      "./circuits/nft.wasm",
      "./circuits/nft.zkey"
    );
    let result = await nftVerifier.verifyProof(
      dataResult.a,
      dataResult.b,
      dataResult.c,
      dataResult.Input
    );
    assert.equal(result, true);
  })


  it("nft.sol works", async () => {
    const NftVerifier = await ethers.getContractFactory("contracts/NftVerifier.sol:Verifier");
    const nftVerifier = await NftVerifier.deploy();
    await nftVerifier.deployed();

    const Metadata = await ethers.getContractFactory("Metadata");
    const metadata = await Metadata.deploy();
    await metadata.deployed();

    const Nft = await ethers.getContractFactory("NFT");
    const nft = await Nft.deploy(metadata.address, nftVerifier.address);
    await nft.deployed();

    console.log(`committing...`)
    await expect(nft.commit())
      .to.not.be.reverted;

    const blockBefore = await ethers.provider.getBlock();
    console.log(`waiting one block`)
    await mine();
    const blockAfter = await ethers.provider.getBlock();

    // make sure block incremented by 1
    assert.equal(blockAfter.number, blockBefore.number + 1);

    console.log(`minting...`)

    await expect(nft.mint())
      .to.not.be.reverted;
    block = await ethers.provider.getBlock();
    console.log({ block: block.number })

    const body = await nft.getBody(1);
    console.log({ body })

    // let dataResult = await exportCallDataGroth16(
    //   sampleInput,
    //   "./circuits/nft.wasm",
    //   "./circuits/nft.zkey"
    // );
    // let result = await nftVerifier.verifyProof(
    //   dataResult.a,
    //   dataResult.b,
    //   dataResult.c,
    //   dataResult.Input
    // );
    // assert.equal(result, true);
  })



});
