#!/bin/bash
START_TIME=$(date +%s)

CIRCUIT=$1
if [ -z "$CIRCUIT" ]; then
  echo "Missing input parameter, circuit. Exiting."
  exit 1
fi


# if CIRCUIT is not defined then exit


# Compile the circuit
circom circuits/${CIRCUIT}.circom --r1cs --wasm --sym --c

echo "done generating the .wasm"

CURRENT_TIME=$(date +%s)
ELAPSED_TIME=$(($CURRENT_TIME - $START_TIME))
START_TIME=$(date +%s)
echo "Elapsed time since last command: $ELAPSED_TIME seconds"

# Generate the witness.wtns
node ${CIRCUIT}_js/generate_witness.js ${CIRCUIT}_js/${CIRCUIT}.wasm circuits/${CIRCUIT}.json ${CIRCUIT}_js/witness.wtns

echo "done generating the witness"

CURRENT_TIME=$(date +%s)
ELAPSED_TIME=$(($CURRENT_TIME - $START_TIME))
START_TIME=$(date +%s)
echo "Elapsed time since last command: $ELAPSED_TIME seconds"