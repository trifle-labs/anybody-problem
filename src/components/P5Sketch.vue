<template>
  <div>
    <!-- <TimerPopup estimate=45></TimerPopup> -->
  <div id="canvas" ref="p5Container"></div>
  <div id="proofs">
    <div v-for="proof, i in proofs" :key="proof.a">
      Sync Anybody Simulation with {{steps + steps * i}} ticks 
      <button onclick="verify(i)">Sync</button>
    </div>
  </div>
</div>
</template>

<script>
const isTest = true
const steps = isTest ? 20 : 500
import p5 from 'p5'
import { Anybody } from '../anybody'

// import MyWorker from 'worker-loader!../proof.worker.js' // Assuming the file is named `myWorker.worker.js`
// const proofWorker = require('../proof.worker.js')
var worker = new Worker('proof.worker.js')
// import TimerPopup from './TimerPopup.vue'
const {  verify } = require('../../utils/utils')
// import { useWebWorkerFn } from '@vueuse/core'

export default {
  name: 'P5Sketch',
  // components: {
  //   TimerPopup
  // },
  data() {
    return {
      anybody: null,
      startTime: null,
      proofs: [],
      steps
    }
  },
  mounted() {
    this.createSketch()
  },
  
  beforeUnmount() {
    this.sketch && this.sketch.remove()
    this.anybody = null
  },
  methods: {
    verify(i) {
      const proof = this.proofs[i]
      console.log('prove proof', {proof})
    },
    onPaused(data) {
      console.log('paused triggered!', {data})
    },
    onFinished(data) {
      console.log('finished steps')
      const bodyInits = data.bodyInits
      const bodyFinal = data.bodyFinal
      const endTime = Date.now()
      const difference = endTime - this.startTime
      const minutes = Math.floor((difference % 3600000) / 60000)
      const seconds = Math.floor((difference % 60000) / 1000)
      const milliseconds = difference % 1000
      console.log(`reached ${steps} steps in ${minutes} minutes, ${seconds} seconds, ${milliseconds} milliseconds`)
      this.prove(bodyInits, bodyFinal)
    },
    async  prove(bodies, finalBodies) {
      this.proofs.push({})
      console.log({bodies, finalBodies})
      const timeStart = Date.now()
      console.log('proving')
      const sampleInput = {
        bodies
      }
      console.dir(sampleInput, {depth: null})
      const circuit = isTest ? 'nftTest' : 'nftProd'
      // const worker = new MyWorker()

      // console.log({worker})
      
      // const { workerFn } = useWebWorkerFn(async (sampleInput, circuit) => {
      // const { groth16 } = require('snarkjs')

      // some heavy works to do in web worker
        
      // let dataResult
      // try {
      //   const input = sampleInput
      //   const wasmPath = `${circuit}.wasm`
      //   const zkeyPath = `${circuit}_final.zkey`
      //   const { proof: _proof, publicSignals: _publicSignals } = await groth16.fullProve(input, wasmPath, zkeyPath)
      //   return { proof: _proof, publicSignals: _publicSignals }

      worker.postMessage({sampleInput, circuit})
      // dataResult = await exportCallDataGroth16(
      //   sampleInput,
      //   `${circuit}.wasm`,
      //   `${circuit}_final.zkey`
      // )
      // } catch (e) {
      //   console.error({e})
      // }

      //   return dataResult
      // })
      // const dataResult = await workerFn(sampleInput, circuit)

      worker.onmessage = async (e) => {
        console.log('Message received from worker', {data: e.data})
        const dataResult = e.data
        const timeEnd = Date.now()
        const difference = timeEnd - timeStart
  
        const minutes = Math.floor((difference % 3600000) / 60000)
        const seconds = Math.floor((difference % 60000) / 1000)
        const milliseconds = difference % 1000
        console.log(`Time taken: ${minutes} minutes, ${seconds} seconds, ${milliseconds} milliseconds`)
        console.log({dataResult})
        finalBodies.flat().map((v, i) => {
          if (v != dataResult.publicSignals[i]) {
            console.error({v, publicSignal: dataResult.publicSignals[i], i})
            throw new Error(`proof generated does not verify results. Mismatch at index ${i}`)
          }
        })
        this.proofs[this.proofs.length - 1] = dataResult

        const res = await verify(`${circuit}_verification_key.json`, dataResult.publicSignals, dataResult.proof)
        console.log({res})
        // this.anybody.setPause(false)
      }

    },
    createSketch() {
      this.startTime = Date.now()
      const sketch = (p) => {
        p.setup = () => {
          this.anybody = new Anybody(p, {
            // seed: 1574n, // NOTE: this seed diverges after 4 proofs
            totalBodies: 3,
            mode: 'nft',
            stopEvery: steps,//487,
          })
          this.anybody.on('finished', (data) => this.onFinished(data))
          this.anybody.on('paused', (data) => this.onPaused(data))
        }
        p.draw = () => {
          this.anybody.draw()
        }
      }
      this.sketch = new p5(sketch, this.$refs.p5Container)
    }
  }
  // Your component options go here
}
</script>

<style>
/* Your component styles go here */
  #canvas canvas {
    border: 1px solid black;
    cursor: crosshair;
    height: min(calc(100vh - 2px), calc(100vw - 2px)) !important;
    width: min(calc(100vh - 2px), calc(100vw - 2px)) !important;
}
#proofs {
  position: absolute;
  top:10px;
  right:10px;
  background: white;
  border: 1px solid black;
  padding:4px;
}
</style>
