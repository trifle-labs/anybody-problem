#!/bin/bash

bash utils/1_create_wasm.sh "$1"
bash utils/2_create_zkey.sh "$1"
bash utils/5_create_solidity.sh "$1"