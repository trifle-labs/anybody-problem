<template>
  <div id="canvas" ref="p5Container"></div>
</template>

<script>
const steps = 487
import p5 from 'p5'
import { Anybody } from '../anybody'
const { exportCallDataGroth16 } = require('../../utils/utils')
export default {
  name: 'P5Sketch',
  mounted() {
    this.createSketch()
  },
  beforeUnmount() {
    this.sketch && this.sketch.remove()
    this.anybody = null
  },
  methods: {
    onPaused(data) {
      console.log('paused triggered!', {data})
    },
    onFinished(data) {
      console.log(`finished at ${data}`)
      console.log(this.anybody.missileInits)
      const missiles = Array.from({ length: steps + 1 })
      for (let i = 0; i < missiles.length; i++) {
        for(let j = 0; j < this.anybody.missileInits.length; j++) {
          const missile = this.anybody.missileInits[j]
          console.log({missile})
          if (i == missile.step) {
            const circomMissile = [
              missile.x,
              missile.y,
              missile.vx,
              missile.vy,
              missile.radius
            ]
            missiles[i] = circomMissile
          }
        }
        if (!missiles[i]) {
          missiles[i] = ['0', '0', '0', '0', '0']
        }
      }
      this.prove(this.anybody.bodyInits, missiles)
    },
    async  prove(bodies, missiles) {
      const timeStart = Date.now()
      console.log('proving')
      const sampleInput = {
        bodies,
        missiles
      }
      console.dir({sampleInput}, {depth: null})
      const circuit = 'stepStateTest'
      let dataResult = await exportCallDataGroth16(
        sampleInput,
        `${circuit}.wasm`,
        `${circuit}_final.zkey`
      )
      const timeEnd = Date.now()
      const difference = timeEnd - timeStart
  
      const minutes = Math.floor((difference % 3600000) / 60000)
      const seconds = Math.floor((difference % 60000) / 1000)
      const milliseconds = difference % 1000
      console.log(`Time taken: ${minutes} minutes, ${seconds} seconds, ${milliseconds} milliseconds`)
      console.log({dataResult})
      console.log({bodies: this.anybody.bodies})
    },
    createSketch() {
      const sketch = (p) => {
        p.setup = () => {
          this.anybody = new Anybody(p, {
            // seed: 4178n,
            totalBodies: 3,
            mode: 'game',
            stopEvery: steps,//487,
          })
          this.anybody.on('finished', this.onFinished)
          this.anybody.on('paused', this.onPaused)
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
</style>
