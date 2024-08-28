const { ethers } = require('hardhat')
const sindri = require('sindri')

const game_4_250_id = '01db9002-7996-4c20-9a5b-18ce6c950689' // v6
const game_6_125_id = 'd91136ad-fe33-4ddc-bb6c-1ebb402c2f9b' // v6
const apiKey = process.env.sindri_api_key

const mint = true
let day

async function main() {
  // const SindriClient = await import('sindri')
  // console.log(sindri)
  sindri.authorize({ apiKey })
  // const sindri = new SindriClient({ apiKey })
  // console.log({ sindri })

  const proofDatas = []
  const { groth16 } = await import('snarkjs')
  const { AnybodyProblem: AnybodyProblemContract } = await import(
    '../dist/module.js'
  )
  for (let i = 0; i < sampleInputs.length; i++) {
    const proofDataArray = sampleInputs[i].map((p) => p.proofData)[0]
    for (let j = 0; j < proofDataArray.length; j++) {
      day = proofDataArray[j].day
      const sampleInput = proofDataArray[j].sampleInput
      const proofData = { sampleInput }
      const circuitCount = sampleInput.bodies.length
      let useCircuit = circuitCount <= 4 ? 4 : 6
      if (useCircuit !== sampleInput.bodies.length) {
        const diff = useCircuit - sampleInput.bodies.length
        for (let i = 0; i < diff; i++) {
          sampleInput.bodies.push(['0', '0', '20000', '20000', '0'])
        }
      }
      proofData.steps = useCircuit == 4 ? 250 : 125
      const circuitId = useCircuit == 4 ? game_4_250_id : game_6_125_id
      let proof
      try {
        proof = await sindri.proveCircuit(circuitId, sampleInput)
      } catch (e) {
        throw new Error(e)
      }
      const {
        public: publicSignals,
        proof: proof_,
        compute_time_sec: proofTime
      } = proof
      proofData.proofTime = Math.floor(proofTime * 1000)
      proofData.proof = proof_
      proofData.publicSignals = publicSignals

      const calldata = await groth16.exportSolidityCallData(
        proof.proof,
        proof.public
      )
      proofData.calldata = calldata
      const argv = calldata
        .replace(/["[\]\s]/g, '')
        .split(',')
        .map((x) => BigInt(x).toString())
      const a = [argv[0], argv[1]]
      const b = [
        [argv[2], argv[3]],
        [argv[4], argv[5]]
      ]
      const c = [argv[6], argv[7]]
      const Input = []
      for (let i = 8; i < argv.length; i++) {
        Input.push(argv[i])
      }
      proofData.a = a
      proofData.b = b
      proofData.c = c
      proofData.Input = Input

      proofDatas.push(proofData)
    }
  }
  const params = [
    0, // runId
    mint,
    day,
    [],
    [],
    [],
    [],
    []
  ]

  params[3].push(...proofDatas.map((p) => p.steps))
  params[4].push(...proofDatas.map((p) => p.a))
  params[5].push(...proofDatas.map((p) => p.b))
  params[6].push(...proofDatas.map((p) => p.c))
  params[7].push(...proofDatas.map((p) => p.Input))

  // const PRICE = 0.00125
  // const batchTx = await anybodyProblem.batchSolve(...params, {
  //   value: mint ? PRICE : '0'
  // })
  const AnybodyProblem = await ethers.getContractFactory('AnybodyProblem')
  const network = await ethers.provider.getNetwork()

  // update ExternalMetadata
  const anybodyAddress =
    AnybodyProblemContract.networks[network.chainId].address
  const anybodyProblem = AnybodyProblem.attach(anybodyAddress)

  const callData = anybodyProblem.interface.encodeFunctionData(
    'batchSolve',
    params
  )

  console.log(callData)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

const _1 = require('./tmp/01.json')
const _2 = require('./tmp/02.json')
const _3 = require('./tmp/03.json')
const _4 = require('./tmp/04.json')
const _5 = require('./tmp/05.json')

const sampleInputs = [_1, _2, _3, _4, _5]
