#!/bin/bash

START_TIME=$(date +%s)


CIRCUIT=$1
if [ -z "$CIRCUIT" ]; then
  echo "Missing input parameter, circuit. Exiting."
  exit 1
fi

# Variable to store the number of the ptau file
PTAU=20

# In case there is a ptau file number as an input
if [ "$2" ]; then
    PTAU=$2
fi

# Check if the necessary ptau file already exists. If it does not exist, it will be downloaded from the data center
if [ -f ./artifacts/circom/hermez.s3-eu-west-1.amazonaws.com_powersOfTau28_hez_final_${PTAU}.ptau ]; then
    echo "----- hermez.s3-eu-west-1.amazonaws.com_powersOfTau28_hez_final_${PTAU}.ptau already exists -----"
else
    echo "----- Please download powersOfTau28_hez_final_${PTAU}.ptau -----"
    exit 1
    #wget -P ./ptau https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_${PTAU}.ptau
fi


echo "----- Generate .zkey file -----"
# Generate a .zkey file that will contain the proving and verification keys together with all phase 2 contributions
snarkjs groth16 setup ${CIRCUIT}.r1cs artifacts/circom/hermez.s3-eu-west-1.amazonaws.com_powersOfTau28_hez_final_${PTAU}.ptau ${CIRCUIT}_0000.zkey


CURRENT_TIME=$(date +%s)
ELAPSED_TIME=$(($CURRENT_TIME - $START_TIME))
START_TIME=$(date +%s)
echo "Elapsed time since last command: $ELAPSED_TIME seconds"

echo "----- Contribute to the phase 2 of the ceremony -----"

ENTROPY=$(head -c32 /dev/urandom | xxd -p -c32)
echo "----- Using entropy $ENTROPY -----"

# Contribute to the phase 2 of the ceremony
snarkjs zkey contribute ${CIRCUIT}_0000.zkey ${CIRCUIT}_final.zkey --name="Billy" -v -e="$ENTROPY"


CURRENT_TIME=$(date +%s)
ELAPSED_TIME=$(($CURRENT_TIME - $START_TIME))
START_TIME=$(date +%s)
echo "Elapsed time since last command: $ELAPSED_TIME seconds"

echo "----- Export the verification key -----"
# Export the verification key
snarkjs zkey export verificationkey ${CIRCUIT}_final.zkey verification_key.json


CURRENT_TIME=$(date +%s)
ELAPSED_TIME=$(($CURRENT_TIME - $START_TIME))
START_TIME=$(date +%s)
echo "Elapsed time since last command: $ELAPSED_TIME seconds"

echo "----- Generate zk-proof -----"
# Generate a zk-proof associated to the circuit and the witness. This generates proof.json and public.json
snarkjs groth16 prove ${CIRCUIT}_final.zkey ${CIRCUIT}_js/witness.wtns proof.json public.json


CURRENT_TIME=$(date +%s)
ELAPSED_TIME=$(($CURRENT_TIME - $START_TIME))
START_TIME=$(date +%s)
echo "Elapsed time since last command: $ELAPSED_TIME seconds"

echo "----- Verify the proof -----"
# Verify the proof
snarkjs groth16 verify verification_key.json public.json proof.json


CURRENT_TIME=$(date +%s)
ELAPSED_TIME=$(($CURRENT_TIME - $START_TIME))
START_TIME=$(date +%s)
echo "Elapsed time since last command: $ELAPSED_TIME seconds"

echo "----- Generate Solidity verifier -----"
# Generate a Solidity verifier that allows verifying proofs on Ethereum blockchain
snarkjs zkey export solidityverifier ${CIRCUIT}_final.zkey ${CIRCUIT}Verifier.sol


CURRENT_TIME=$(date +%s)
ELAPSED_TIME=$(($CURRENT_TIME - $START_TIME))
START_TIME=$(date +%s)
echo "Elapsed time since last command: $ELAPSED_TIME seconds"

# Update the solidity version in the Solidity verifier
sed -i 's/0.6.11;/0.8.4;/g' ${CIRCUIT}Verifier.sol
# Update the contract name in the Solidity verifier
sed -i "s/contract Verifier/contract ${CIRCUIT^}Verifier/g" ${CIRCUIT}Verifier.sol

echo "----- Generate and print parameters of call -----"
# Generate and print parameters of call
snarkjs generatecall | tee parameters.txt


CURRENT_TIME=$(date +%s)
ELAPSED_TIME=$(($CURRENT_TIME - $START_TIME))
START_TIME=$(date +%s)
echo "Elapsed time since last command: $ELAPSED_TIME seconds"
