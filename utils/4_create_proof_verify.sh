#!/bin/bash

START_TIME=$(date +%s)


CIRCUIT=$1
if [ -z "$CIRCUIT" ]; then
  echo "Missing input parameter, circuit. Exiting."
  exit 1
fi

# echo "----- Generate zk-proof -----"
# # Generate a zk-proof associated to the circuit and the witness. This generates proof.json and public.json
# snarkjs groth16 prove ${CIRCUIT}_final.zkey ${CIRCUIT}_js/witness.wtns proof.json public.json

echo "----- Running fullprove -----"
snarkjs groth16 fullprove circuits/${CIRCUIT}.json ${CIRCUIT}_js/${CIRCUIT}.wasm ${CIRCUIT}_final.zkey ${CIRCUIT}_proof.json ${CIRCUIT}_public.json

CURRENT_TIME=$(date +%s)
ELAPSED_TIME=$(($CURRENT_TIME - $START_TIME))
START_TIME=$(date +%s)
echo "Elapsed time since last command: $ELAPSED_TIME seconds"

echo "----- Verify the proof -----"
# Verify the proof
snarkjs groth16 verify ${CIRCUIT}_verification_key.json ${CIRCUIT}_public.json ${CIRCUIT}_proof.json


CURRENT_TIME=$(date +%s)
ELAPSED_TIME=$(($CURRENT_TIME - $START_TIME))
START_TIME=$(date +%s)
echo "Elapsed time since last command: $ELAPSED_TIME seconds"
