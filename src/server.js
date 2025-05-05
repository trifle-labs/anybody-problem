export const Server = {
  async serverInit() {
    this.allPlayers = []
    setInterval(() => {
      this.randomAction()
    }, 5000)
  },
  randomAction() {
    console.log({ paused: this.paused, drawIntro: this.drawIntro })
    if (this.paused) return
    if (!this.playedIntro) return
    if (this.bodies.length == 1) {
      this.playerJoins()
      return
    }
    const playerShootsOdds = 0.5
    const playerJoinsOdds = 0.4
    // const playerLeavesOdds = 0.1
    const random = Math.random()
    if (random < playerShootsOdds) {
      this.playerShoots()
    } else if (random < playerJoinsOdds + playerShootsOdds) {
      this.playerJoins()
    } else {
      this.playerLeaves()
    }
  },
  async playerJoins() {
    const randomDay = Math.floor(Math.random() * 1000000)
    const newPlayerBody = this.generateLevelData(randomDay, -1)
    const transformed = this.bodyDataToBodies.call(
      this,
      newPlayerBody[0],
      randomDay
    )
    console.log('playerJoins', { transformed })
    this.bodies.push(transformed)
  },
  async playerLeaves() {
    if (this.bodies.length == 1) return
    const randomPlayer =
      this.bodies[Math.floor(Math.random() * this.bodies.length - 1) + 1]
    console.log('playerLeaves', { randomPlayer })
    this.bodies = this.bodies.filter((b) => b.id !== randomPlayer.id)
  },
  async playerShoots() {
    if (this.bodies.length == 1) return
    const randomPlayerIndex =
      Math.floor(Math.random() * this.bodies.length - 1) + 1
    const randomX = Math.floor(Math.random() * this.windowWidth)
    const randomY = Math.floor(Math.random() * this.windowHeight)
    console.log('playerShoots', { randomPlayerIndex, randomX, randomY })
    this.missileClick(randomPlayerIndex, randomX, randomY)
  }
}
