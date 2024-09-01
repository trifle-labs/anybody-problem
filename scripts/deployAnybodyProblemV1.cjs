async function main() {
  const { deployAnybodyProblemV1 } = await import('./utils.js')
  await deployAnybodyProblemV1(false)
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
