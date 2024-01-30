#!/bin/bash

bash scripts/1_create_wasm.sh "$1"
bash scripts/2_create_zkey.sh "$1"
bash scripts/3_copy_files_to_public.sh "$1"
bash scripts/4_create_solidity.sh "$1"