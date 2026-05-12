async function main() {
  const { deployAnybodyProblemV5, saveAndVerifyContracts } = await import(
    './utils.js'
  )
  const deployedContracts = await deployAnybodyProblemV5({
    ignoreTesting: true
  })
  await saveAndVerifyContracts(deployedContracts)
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
