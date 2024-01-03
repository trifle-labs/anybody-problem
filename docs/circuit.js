import { ethers } from './ethers/dist/ethers.esm.min.js';
let submitting = false;
const submit = document.getElementById('submit');
console.log({ submit });

submit.addEventListener('click', async () => {
  console.log('click')
  if (submitting) {
    return
  }

  const sampleInput = window.initialBodies
  console.log({ sampleInput })

  return
  submitting = true
  submit.innerText = 'Submitting...'
  const NftVerifier = await ethers.getContractFactory("contracts/NftVerifier.sol:Groth16Verifier");
  const nftVerifier = await NftVerifier.deploy();
  await nftVerifier.deployed();

  let dataResult = await exportCallDataGroth16(
    sampleInput,
    "./nft_js/nft.wasm",
    "./nft_final.zkey"
  );
  let result = await nftVerifier.verifyProof(
    dataResult.a,
    dataResult.b,
    dataResult.c,
    dataResult.Input
  );
  console.log({ result })
  submitting = false
  submit.innerText = 'Submit'
})