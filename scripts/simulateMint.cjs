async function main() {
  const hre = require('hardhat')
  const newV5 = '0xDa9a03984a259A8ce19D9d71BF56cbF6471D2a19'
  const [signer] = await hre.ethers.getSigners()
  const abi = [
    'function mint() external',
    'function currentDay() view returns (uint256)',
    'function speedruns() view returns (address)',
    'function mintPrice() view returns (uint256)',
    'function usdc() view returns (address)',
    'function paused() view returns (bool)'
  ]
  const v5 = new hre.ethers.Contract(newV5, abi, signer)
  console.log('currentDay   =', (await v5.currentDay()).toString())
  console.log('mintPrice    =', (await v5.mintPrice()).toString())
  console.log('speedruns    =', await v5.speedruns())
  console.log('usdc         =', await v5.usdc())
  console.log('paused       =', await v5.paused())
  try {
    // Try a static call from a no-balance, no-allowance EOA — should give the actual revert reason
    const result = await v5.callStatic.mint({ from: '0x0000000000000000000000000000000000000001' })
    console.log('callStatic OK:', result)
  } catch (e) {
    console.log('revert:', e.reason || e.error?.reason || e.message)
  }
}
main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1) })
