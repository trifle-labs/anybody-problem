#!/bin/bash

START_TIME=$(date +%s)
CIRCUIT=$1
if [ -z "$CIRCUIT" ]; then
  echo "Missing input parameter, circuit. Exiting."
  exit 1
fi

echo "----- Generate Solidity verifier -----"
# Generate a Solidity verifier that allows verifying proofs on Ethereum blockchain
CIRCUIT_TITLECASE=$(echo $CIRCUIT | awk '{print toupper(substr($0,1,1))substr($0,2)}')
snarkjs zkey export solidityverifier ${CIRCUIT}_final.zkey contracts/${CIRCUIT_TITLECASE}Verifier.sol


CURRENT_TIME=$(date +%s)
ELAPSED_TIME=$(($CURRENT_TIME - $START_TIME))
START_TIME=$(date +%s)
echo "Elapsed time since last command: $ELAPSED_TIME seconds"

# # Update the solidity version in the Solidity verifier
# sed -i 's/0.6.11;/0.8.4;/g' ${CIRCUIT}Verifier.sol
# Update the contract name in the Solidity verifier
# sed -i "s/contract Verifier/contract ${CIRCUIT^}Verifier/g" contracts/${CIRCUIT}Verifier.sol

# echo "----- Generate and print parameters of call -----"
# # Generate and print parameters of call
# snarkjs generatecall | tee parameters.txt

# CURRENT_TIME=$(date +%s)
# ELAPSED_TIME=$(($CURRENT_TIME - $START_TIME))
# START_TIME=$(date +%s)
# echo "Elapsed time since last command: $ELAPSED_TIME seconds"
