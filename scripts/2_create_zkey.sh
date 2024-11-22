#!/bin/bash

START_TIME=$(date +%s)


CIRCUIT=$1
if [ -z "$CIRCUIT" ]; then
  echo "Missing input parameter, circuit. Exiting."
  exit 1
fi

# Variable to store the number of the ptau file
PTAU=25

# In case there is a ptau file number as an input
if [ "$2" ]; then
    PTAU=$2
fi

PTAU_PATH1="./artifacts/circom/hermez.s3-eu-west-1.amazonaws.com_powersOfTau28_hez_final_"
PTAU_PATH2="./ptau/powersOfTau28_hez_final_"


# Check if the necessary ptau file already exists. If it does not exist, it will be downloaded from the data center
if [ -f ${PTAU_PATH1}${PTAU}.ptau ]; then
    PTAU_PATH=${PTAU_PATH1}${PTAU}.ptau
    echo "----- hermez.s3-eu-west-1.amazonaws.com_powersOfTau28_hez_final_${PTAU}.ptau already exists -----"
elif [ -f ${PTAU_PATH2}${PTAU}.ptau ]; then
    PTAU_PATH=${PTAU_PATH2}${PTAU}.ptau
else
    echo "----- Downloading powersOfTau28_hez_final_${PTAU}.ptau -----"
    curl -o ./ptau/powersOfTau28_hez_final_${PTAU}.ptau https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_${PTAU}.ptau
    PTAU_PATH=${PTAU_PATH2}${PTAU}.ptau
fi


echo "----- Generate .zkey file -----"


# Check if snarkjs is installed
if ! command -v snarkjs &> /dev/null; then
    echo "snarkjs could not be found. Please install snarkjs before running this script."
    exit 1
fi

# Generate a .zkey file that will contain the proving and verification keys together with all phase 2 contributions
node --max-old-space-size=32768 $(which snarkjs) groth16 setup ${CIRCUIT}.r1cs ${PTAU_PATH} ${CIRCUIT}_0000.zkey


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
snarkjs zkey export verificationkey ${CIRCUIT}_final.zkey ${CIRCUIT}_verification_key.json


CURRENT_TIME=$(date +%s)
ELAPSED_TIME=$(($CURRENT_TIME - $START_TIME))
START_TIME=$(date +%s)
echo "Elapsed time since last command: $ELAPSED_TIME seconds"

