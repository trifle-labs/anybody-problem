async function main() {
  const { deployVerifiers, saveAndVerifyContracts, initContracts } =
    await import('./utils.js')
  const { returnObject, verifiers, verifiersBodies, verifiersTicks } =
    await deployVerifiers({
      verbose: true,
      ignoreTesting: true
    })
  await saveAndVerifyContracts(returnObject)
  const { AnybodyProblemV2 } = await initContracts(['AnybodyProblemV2'])

  //   function updateVerifier(
  //     address verifier_,
  //     uint256 verifierBodies,
  //     uint256 verifierTicks
  // ) public onlyOwner {
  //     verifiers[verifierBodies][verifierTicks] = verifier_;
  // }
  for (let i = 0; i < verifiers.length; i++) {
    const verifierAddress = verifiers[i]
    const verifierBody = verifiersBodies[i]
    const verifierTick = verifiersTicks[i]
    console.log({ verifierAddress, verifierBody, verifierTick })
    await AnybodyProblemV2.updateVerifier(
      verifierAddress,
      verifiersBodies,
      verifierTick
    )
  }
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
