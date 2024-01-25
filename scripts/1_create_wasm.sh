#!/bin/bash
START_TIME=$(date +%s)

# if CIRCUIT is not defined then exit
CIRCUIT=$1
if [ -z "$CIRCUIT" ]; then
  echo "Missing input parameter, circuit. Exiting."
  exit 1
fi


# Compile the circuit
~/.cargo/bin/circom circuits/${CIRCUIT}.circom --r1cs --wasm --sym --c

echo "done generating the .wasm"

CURRENT_TIME=$(date +%s)
ELAPSED_TIME=$(($CURRENT_TIME - $START_TIME))
START_TIME=$(date +%s)
echo "Elapsed time since last command: $ELAPSED_TIME seconds"
