<template>
<div>
    <!-- <TimerPopup estimate=45></TimerPopup> -->
  <div id="canvas" ref="p5Container"></div>
  <div id="proofs">
    <div v-for="proof, i in proofs" :key="proof.a">
        <button :disabled="!proof.complete" onclick="verify(i)">Sync</button>
        {{ proof.complete ? '✅' : '⏳' }}
          Tick {{steps + steps * i}}
    </div>
  </div>
</div>
</template>

<script>
const isTest = false
const steps = isTest ? 20 : 500
import p5 from 'p5'
import { Anybody } from '../anybody'

// import MyWorker from 'worker-loader!../proof.worker.js' // Assuming the file is named `myWorker.worker.js`
// const proofWorker = require('../proof.worker.js')
const worker = new Worker('proof.worker.js')
// import TimerPopup from './TimerPopup.vue'
const {  verify } = require('../../scripts/circuits')
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
    // this.sketch && this.sketch.remove()
    // this.anybody = null
  },
  methods: {
    verify(){//i) {
      // const proof = this.proofs[i]
      // console.log('prove proof', {proof})
    },
    onPaused(){//data) {
      // console.log('paused triggered!', {data})
    },
    onFinished(data) {
      // console.log('finished steps')
      const bodyInits = data.bodyInits
      const bodyFinal = data.bodyFinal
      // const endTime = Date.now()
      // const difference = endTime - this.startTime
      // const minutes = Math.floor((difference % 3600000) / 60000)
      // const seconds = Math.floor((difference % 60000) / 1000)
      // const milliseconds = difference % 1000
      // console.log(`reached ${steps} steps in ${minutes} minutes, ${seconds} seconds, ${milliseconds} milliseconds`)
      this.prove(bodyInits, bodyFinal)
    },
    async  prove(bodies, finalBodies) {
      // this.proofs.push({})
      // console.log({bodies, finalBodies})
      // const timeStart = Date.now()
      // console.log('proving')
      const sampleInput = {
        bodies
      }
      const circuit = isTest ? 'nft_3_20' : 'nftProd'    
      this.proofs.push({sampleInput, circuit, finalBodies})

      if (this.proofs.length !== 1) return

      // console.dir(sampleInput, {depth: null})
      worker.postMessage({sampleInput, circuit, finalBodies, index: this.proofs.length - 1})
      // this.anybody.setPause(false)

      worker.onmessage = async (e) => {
        console.log('Message received from worker', {data: e.data})
        const dataResult = e.data
        console.log({dataResult})
        const finalBodies = dataResult.finalBodies
        // console.log({finalBodies})
        // const timeEnd = Date.now()
        // const difference = timeEnd - timeStart
  
        // const minutes = Math.floor((difference % 3600000) / 60000)
        // const seconds = Math.floor((difference % 60000) / 1000)
        // const milliseconds = difference % 1000
        // console.log(`Time taken: ${minutes} minutes, ${seconds} seconds, ${milliseconds} milliseconds`)
        // console.log({dataResult})
        finalBodies.flat().map((v, i) => {
          if (v != dataResult.publicSignals[i]) {
            console.error({v, publicSignal: dataResult.publicSignals[i], i})
            throw new Error(`proof generated does not verify results. Mismatch at index ${i}`)
          }
        })
        this.proofs[dataResult.index] = dataResult

        const res = await verify(`${circuit}_verification_key.json`, dataResult.publicSignals, dataResult.proof)
        // console.log({res})
        if (!res) {
          throw new Error('proof failed to verify')
        }

        if (this.proofs.length > dataResult.index + 1 ) {
          console.log(this.proofs[dataResult.index + 1])
          const {sampleInput, circuit, finalBodies } = JSON.parse(JSON.stringify(this.proofs[dataResult.index + 1]))
          console.log({sampleInput, circuit, finalBodies })
          worker.postMessage({sampleInput, circuit, finalBodies, index: dataResult.index + 1})
          // worker.postMessage({})
        }

      }

    },
    createSketch() {
      this.startTime = Date.now()
      const sketch = (p) => {
        p.setup = () => {
          this.anybody = new Anybody(p, {
            // preRun: 480,
            // seed: 94n, // NOTE: this seed diverges after 4 proofs
            totalBodies: 3,
            mode: 'nft',
            stopEvery: steps,//487,
            seed: 1n,
            // inputData: [
            //   [ '616000', '599000', '10000', '10000', '13000' ],
            //   [ '257000', '602000', '10000', '10000', '12000' ],
            //   [ '98000', '901000', '10000', '10000', '11000' ]
            // ]
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
  /* border: 1px solid black; */
  /* padding:4px; */
  max-height: 200px;
  overflow: scroll;
}
#proofs div {
  margin: 4px;
}
</style>
