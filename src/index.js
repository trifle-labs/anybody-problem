export { Anybody } from './anybody.js'
// export * as circuits from '../scripts/circuits.js'
// const utils = require('../scripts/utils')

import ProblemsABI from '../server/contractData/ABI-84532-Problems.json'
import ProblemsForma from '../server/contractData/80085-Problems.json'
import ProblemsLocal from '../server/contractData/12345-Problems.json'
import ProblemsSepolia from '../server/contractData/11155111-Problems.json'
import ProblemsGarnet from '../server/contractData/17069-Problems.json'
import ProblemsBaseSepolia from '../server/contractData/84532-Problems.json'

export const Problems = {
  abi: ProblemsABI,
  networks: {
    80085: ProblemsForma,
    12345: ProblemsLocal,
    11155111: ProblemsSepolia,
    17069: ProblemsGarnet,
    84532: ProblemsBaseSepolia
  }
}

import BodiesABI from '../server/contractData/ABI-84532-Bodies.json'
import BodiesForma from '../server/contractData/80085-Bodies.json'
import BodiesLocal from '../server/contractData/12345-Bodies.json'
import BodiesSepolia from '../server/contractData/11155111-Bodies.json'
import BodiesGarnet from '../server/contractData/17069-Bodies.json'
import BodiesBaseSepolia from '../server/contractData/84532-Bodies.json'

export const Bodies = {
  abi: BodiesABI,
  networks: {
    80085: BodiesForma,
    12345: BodiesLocal,
    11155111: BodiesSepolia,
    17069: BodiesGarnet,
    84532: BodiesBaseSepolia
  }
}

import SolverABI from '../server/contractData/ABI-84532-Solver.json'
import SolverForma from '../server/contractData/80085-Solver.json'
import SolverLocal from '../server/contractData/12345-Solver.json'
import SolverSepolia from '../server/contractData/11155111-Solver.json'
import SolverGarnet from '../server/contractData/17069-Solver.json'
import SolverBaseSepolia from '../server/contractData/84532-Solver.json'

export const Solver = {
  abi: SolverABI,
  networks: {
    80085: SolverForma,
    12345: SolverLocal,
    11155111: SolverSepolia,
    17069: SolverGarnet,
    84532: SolverBaseSepolia
  }
}

import ProblemMetadataABI from '../server/contractData/ABI-84532-ProblemMetadata.json'
import ProblemMetadataSepolia from '../server/contractData/11155111-ProblemMetadata.json'
import ProblemMetadataLocal from '../server/contractData/12345-ProblemMetadata.json'
import ProblemMetadataGarnet from '../server/contractData/17069-ProblemMetadata.json'
import ProblemMetadataBaseSepolia from '../server/contractData/84532-ProblemMetadata.json'

export const ProblemMetadata = {
  abi: ProblemMetadataABI,
  networks: {
    11155111: ProblemMetadataSepolia,
    12345: ProblemMetadataLocal,
    17069: ProblemMetadataGarnet,
    84532: ProblemMetadataBaseSepolia
  }
}

import BodyMetadataABI from '../server/contractData/ABI-84532-BodyMetadata.json'
import BodyMetadataSepolia from '../server/contractData/11155111-BodyMetadata.json'
import BodyMetadataLocal from '../server/contractData/12345-BodyMetadata.json'
import BodyMetadataGarnet from '../server/contractData/17069-BodyMetadata.json'
import BodyMetadataBaseSepolia from '../server/contractData/84532-BodyMetadata.json'

export const BodyMetadata = {
  abi: BodyMetadataABI,
  networks: {
    11155111: BodyMetadataSepolia,
    12345: BodyMetadataLocal,
    17069: BodyMetadataGarnet,
    84532: BodyMetadataBaseSepolia
  }
}

// export default {
//   Anybody,
//   // circuits,
//   Problems,
//   Bodies,
//   Solver,
//   ProblemMetadata,
//   BodyMetadata
// }
