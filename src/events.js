class Emitter {
  constructor() {
    this.eventsNames = {}

    this.on = (callName, callback_f) => {
      if (typeof callback_f != 'function')
        throw new Error("Callback must must type of 'function'.")
      if (this.eventsNames[callName] == undefined)
        this.eventsNames[callName] = []
      this.eventsNames[callName].push(callback_f)
    }
    this.off = (callName) => {
      return this.removeListeners(callName)
    }
    this.emit = (callName, datas) => {
      if (this.eventsNames[callName] == undefined) return
      for (let i in this.eventsNames[callName]) {
        try {
          this.eventsNames[callName][i](datas)
        } catch (e) {
          console.log(e)
        }
      }
    }
    this.removeListeners = (callName) => (this.eventsNames[callName] = [])
    this.removeAllListeners = () => (this.eventsNames = {})
    this.countListeners = (callName) =>
      this.eventsNames[callName] != undefined
        ? this.eventsNames[callName].length
        : 0
  }
}

export default Emitter
