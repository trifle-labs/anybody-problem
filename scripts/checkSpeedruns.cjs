async function main() {
  const hre = require('hardhat')
  const SP = '0x127b889FcE2b1Bd3b0941FF7ce4Fd0e2EEfe69B9'
  const EM = '0x5095CD65B301fB2f4d2078638f29C6Fa9d92cBe1'
  const newV5 = '0xDa9a03984a259A8ce19D9d71BF56cbF6471D2a19'
  const newHistory = '0xA3a35529A65b041Ad11927203167E6146b3c3d08'
  const [signer] = await hre.ethers.getSigners()
  const sp = new hre.ethers.Contract(SP, ['function anybodyProblem() view returns (address)'], signer)
  const em = new hre.ethers.Contract(EM, ['function anybodyProblem() view returns (address)'], signer)
  const v5sr = await new hre.ethers.Contract(newV5, ['function speedruns() view returns (address)'], signer).speedruns()
  console.log('Speedruns.anybodyProblem  =', await sp.anybodyProblem())
  console.log('ExternalMeta.anybodyProblem=', await em.anybodyProblem())
  console.log('V5.speedruns              =', v5sr)
  console.log('Expected V5               =', newV5)
  console.log('History (should NOT match)=', newHistory)
}
main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1) })
