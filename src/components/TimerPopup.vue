<template>
  <div>
    <h1>TimerPopup</h1>
    {{ runningEstimate }}
  </div>
</template>

<script>
export default {
  name: 'TimerPopup',
  props: {
    estimate: null
  },
  data() {
    return {
      runningEstimate: this.estimate
    }
  },
  mounted() {
    this.interval = setInterval(this.count, 1000)
  },
  beforeUnmount() {
    clearInterval(this.interval)
  },
  methods: {
    count() {
      this.runningEstimate -= 1
    }
  }
}
</script>

<style scoped>
/* Your component styles go here */
  div {
    position: absolute;
    top:100px;
    left:50%;
    margin-left:-100px;
    width:200px;
    background: white;
    z-index:2;
    border:1px solid black;
    padding:10px;
  }
</style>
