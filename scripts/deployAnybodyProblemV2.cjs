async function main() {
  const { deployAnybodyProblemV2, saveAndVerifyContracts } = await import(
    './utils.js'
  )
  const deployedContracts = await deployAnybodyProblemV2({
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
