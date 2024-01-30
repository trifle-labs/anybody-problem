#!/bin/bash

START_TIME=$(date +%s)

CIRCUIT=$1
if [ -z "$CIRCUIT" ]; then
  echo "Missing input parameter, circuit. Exiting."
  exit 1
fi

echo "----- Copying files to public directory -----"
cp ${CIRCUIT}_final.zkey public/
cp ${CIRCUIT}_verification_key.json public/
cp ${CIRCUIT}_js/${CIRCUIT}.wasm public/


CURRENT_TIME=$(date +%s)
ELAPSED_TIME=$(($CURRENT_TIME - $START_TIME))
START_TIME=$(date +%s)
echo "Elapsed time since last command: $ELAPSED_TIME seconds"

