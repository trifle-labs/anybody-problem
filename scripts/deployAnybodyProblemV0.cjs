async function main() {
  const { deployContractsV0, saveAndVerifyContracts } = await import(
    './utils.js'
  )
  const deployedContracts0 = await deployContractsV0({ ignoreTesting: true })
  await saveAndVerifyContracts(deployedContracts0)
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
