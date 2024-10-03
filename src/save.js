import presaved from './min-presaved.json'
import maxPresaved from './max-presaved.json'

import pako from 'pako'
import msgpack from 'msgpack-lite'
import base91 from 'node-base91'
import QRCode from 'qrcode'
// const zkPrefix = 'https://anybody-proverfiles.fra1.digitaloceanspaces.com/v7'
// const keyConversion = {}
// const lookupKey = (key) => {
//   if (keyConversion[key]) return keyConversion[key]
//   const keyLength = Object.keys(keyConversion).length
//   keyConversion[key] = keyLength
//   return keyLength
// }

const convertBase64URLtoQRCode = async (base64UrlSafe) => {
  const fullURL = `https://anybody.gg#${base64UrlSafe}`
  const qrCodeImage = await QRCode.toDataURL(fullURL, {
    errorCorrectionLevel: 'L'
  })
  console.log({ qrCodeImage })
}

const convertMissiles = (missiles) => {
  const compressedMissiles = []
  let isCompressing = false
  let currentCompression = 0
  for (let i = 0; i < missiles.length; i++) {
    const missile = missiles[i]
    if (missile.reduce((acc, val) => parseInt(acc) + parseInt(val), 0) === 0) {
      if (isCompressing) {
        currentCompression++
      } else {
        isCompressing = true
        currentCompression = 1
      }
      continue
    } else if (isCompressing) {
      compressedMissiles.push([currentCompression])
    }
    compressedMissiles.push(missile.map((m) => parseInt(m)))
  }
  return compressedMissiles
}

const convertAllSringsToNumbers = (obj, depth = 0) => {
  if (depth > 6) return obj
  const isArray = Array.isArray(obj)
  const newObj = isArray ? [] : {}
  const keys = isArray ? obj : Object.keys(obj)
  for (let i = 0; i < keys.length; i++) {
    const key = isArray ? i : keys[i]
    let val = obj[key]
    if (key === 'bodyFinal') {
      val = []
    } else if (key === 'bodyInits') {
      val = []
    } else if (key === 'missiles') {
      val = convertMissiles(val)
    }
    if (typeof val === 'object' && val !== null) {
      newObj[key] = convertAllSringsToNumbers(val, depth + 1)
    } else if (typeof val === 'string') {
      newObj[key] = !isNaN(parseInt(val)) ? parseInt(val) : val
    } else {
      newObj[key] = val
    }
  }
  return newObj
}
try {
  console.log('start')
  presaved.unsavedRun.levels = presaved.unsavedRun.levels.map(
    convertAllSringsToNumbers
  )
  console.log({ presaved })
} catch (e) {
  console.error({ e })
}
const stringified = JSON.stringify(presaved)
console.log({ stringifiedLength: stringified.length })
const serialized = msgpack.encode(presaved)
console.log({ serializedLength: serialized.length })
const serializedCompressed = pako.deflate(serialized)
console.log({ serializedCompressedLength: serializedCompressed.length })
// const compressed = pako.deflate(JSON.stringify(presaved))

// Encode to Base64 URL-safe
const base64UrlSafe = Buffer.from(serializedCompressed)
  .toString('base64')
  .replace(/\+/g, '-')
  .replace(/\//g, '_')
  .replace(/=+$/, '')
console.log({ base64UrlSafe })
console.log(base64UrlSafe.length)

const base91Encoded = base91.encode(serializedCompressed)
console.log({ base91Encoded })
console.log(base91Encoded.length)

const maxSerialized = msgpack.encode(maxPresaved)
console.log({ maxSerializedLength: maxSerialized.length })
const maxSerializedCompressed = pako.deflate(maxSerialized)
console.log({ maxSerializedCompressedLength: maxSerializedCompressed.length })
const maxBase64UrlSafe = Buffer.from(maxSerializedCompressed)
  .toString('base64')
  .replace(/\+/g, '-')
  .replace(/\//g, '_')
  .replace(/=+$/, '')
console.log({ maxBase64UrlSafe })
console.log(maxBase64UrlSafe.length)

convertBase64URLtoQRCode(base91Encoded)

const proofDataTemplate = {
  // zkPrefix,
  // a: [],
  // b: [],
  // c: [],
  // proofTime: null,
  // Input: [],
  // bodyData: [],
  // finalBodies: [],
  uid: null
  // status: null // 'proving', 'verified', 'failed'
}
const newProofData = (proofData) => {
  const uid = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
  return {
    ...proofDataTemplate,
    ...proofData,
    uid
  }
}
const unsentLevel = {
  day: null,
  level: null,
  framesTook: null,
  proofData: []
}
const newLevel = (levelData) => {
  return {
    ...unsentLevel,
    ...levelData
  }
}
const unsavedRun = {
  day: null,
  levels: []
}
const newUnsavedRun = (runData) => {
  return {
    ...unsavedRun,
    ...runData
  }
}
const MAX_LEVEL = 5

export const Save = {
  p5e_save() {
    console.log({ unsavedRun: JSON.stringify(this.unsavedRun) })
  },
  p5e_started({ day, level }) {
    console.log('p5e_started')
    if (level == 0) return
    if (level > MAX_LEVEL) return
    const currentRun = this.unsavedRuns || newUnsavedRun({ day })
    // check current run for specific level
    const curLvlLen = currentRun.levels.length
    let levelIndex = curLvlLen - 1
    if (curLvlLen < level) {
      if (level - curLvlLen > 1) {
        throw new Error('Cannot skip levels')
      }
      currentRun.levels.push(newLevel({ day, level }))
      levelIndex++
    } else if (curLvlLen > level) {
      console.error('level has already been started, removing and trying again')
      console.log({ currentRun })
      currentRun.levels = currentRun.levels.slice(0, level - 1)
      this.unsavedRun = currentRun
      return this.p5e_started({ day, level })
    }
    const levelData = currentRun.levels[levelIndex]
    levelData.proofData = []
    currentRun.levels[levelIndex] = levelData
    this.unsavedRun = currentRun
  },
  p5e_chunk(data) {
    console.log({ unsavedRun: JSON.stringify(data) })

    console.log('p5e_chunk')
    const { day, level } = data
    if (level == 0) return

    if (this.day !== day)
      throw new Error(`Have not handled day change yet ${this.day} !== ${day}`)

    const run = this.unsavedRun
    if (!run) {
      throw new Error(
        'No unsaved run found, this should have happened in p5e_started()'
      )
    }

    const curLvlLen = run.levels.length
    if (curLvlLen < level) {
      throw new Error(
        'Level not started, this should have happened in p5e_started()'
      )
    }
    const levelData = run.levels[curLvlLen - 1]
    data.circuit = `game_${level + 1}_${this.proverTickIndex(level + 1)}`
    data.missiles = convertMissiles(data.missiles)
    // const minimalData = {
    //   level: data.level,
    //   missiles: data.missiles,
    //   incomingMissiles: data.incomingMissiles,
    //   outflightMissile: data.outflightMissile
    // }
    // const proofData = newProofData(minimalData)
    const proofData = newProofData(data)
    levelData.proofData.push(proofData)
    levelData.framesTook = levelData.proofData.reduce(
      (acc, p) => acc + p.framesTook,
      0
    )
    // if (levelData.proofData.length > 1) {
    //   // ensure that the previous proofData outgoing missiles matches the current proofData incoming misisles
    //   const prevProofData = levelData.proofData[levelData.proofData.length - 2]
    //   const currentProofData = levelData.proofData[levelData.proofData.length - 1]
    //   console.dir({ prevProofData, currentProofData }, { depth: null })
    // // TODO: this isn't properly checking whether they're the same
    //   if (prevProofData.outflightMissile !== currentProofData.incomingMissiles) {
    //     throw new Error('Outgoing missiles do not match incoming missiles')
    //   }
    // }
    // TODO: check whether writing back to run.levels is necessary
    run.levels[curLvlLen - 1] = levelData
    this.unsavedRun = run
  },
  p5e_undo() {
    /* 
    NOTE: this is only called when a missile is still in-flight after a chunk of play
    has ended and a new missile is fired, meant to replace the in-flight missile. Since
    the original in-flight missile is already part of a chunk of play (and corresponding
    proofData), we need to remove it from the previous proofData.
    */
    console.log('p5e_undo')
    const run = this.unsavedRun
    const currentLevel = run.levels[run.levels.length - 1]
    const mostRecentProofData =
      currentLevel.proofData[currentLevel.proofData.length - 1]
    console.log({ mostRecentProofData })
    console.log({
      mostRecentProofData: JSON.parse(JSON.stringify(mostRecentProofData))
    })
    // remove outflight missile
    // TODO: error if no outflight missile (should not have been called in first place)
    // const outflightCopy = JSON.parse(JSON.stringify(mostRecentProofData.outflightMissile))
    mostRecentProofData.outflightMissile = ['0', '1000000', '0', '0', '0']

    // loop from end of missiles until last missile shot is found
    // TODO: count how many steps and multiply by vector to confirm it matches outflight missile
    for (let i = mostRecentProofData.missiles.length - 1; i > 0; i--) {
      if (mostRecentProofData.missiles[i][2] !== '0') {
        console.log('EDITING MISSILE', i)
        mostRecentProofData.missiles[i] = ['0', '0', '0']
        break
      }
    }

    // // remove same missile from SampleInput.missiles
    // if (mostRecentProofData.sampleInput && mostRecentProofData.sampleInput.missiles) {
    //   console.log('EDITING SAMPLE INPUT')
    //   mostRecentProofData.sampleInput.missiles[missileIndex] = ['20000', '20000', '0']
    // } else {
    //   console.log('mostRecentProofData does NOT have sampleInput')
    // }
    this.updateProofData(mostRecentProofData)
  },
  // p5 event for when a game is done, either won or lost
  // handles proofData and proving logic if game was lost
  p5e_done(data) {
    console.log('p5e_done', { data })
    if (data.level == 0) return
    const currentRun = this.unsavedRun
    const level = currentRun.levels.length
    if (!data.won) {
      // clear current level proof data
      const levelData = currentRun.levels[level - 1]
      levelData.proofData = []
      currentRun.levels[level - 1] = levelData
      this.unsavedRun = currentRun
    }
    // tell p5e_chunk to ignore next chunk add relevant data to proof stack for relevant day
    // or erase all level data for a run in case it is a loss
  },
  updateProofData(proofData) {
    const run = this.unsavedRun
    const levelIndex = run.levels.findIndex((l) => proofData.level === l.level)
    if (levelIndex < 0) {
      throw new Error('No level found for proofData')
    }
    const proofIndex = run.levels[levelIndex].proofData.findIndex(
      (p) => proofData.uid == p.uid
    )
    if (proofIndex < 0) {
      throw new Error('No proof found for proofData')
    }
    run.levels[levelIndex].proofData[proofIndex] = proofData
    this.unsavedRun = run
  }
}
