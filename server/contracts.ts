import ProblemsABI from './contractData/ABI-84532-Problems.json'
// import ProblemsForma from './contractData/80085-Problems.json'
// import ProblemsLocal from './contractData/12345-Problems.json'
// import ProblemsSepolia from './contractData/11155111-Problems.json'
// import ProblemsGarnet from './contractData/17069-Problems.json'
import ProblemsBaseSepolia from './contractData/84532-Problems.json'

export const Problems = {
  abi: ProblemsABI,
  networks: {
    // 80085: ProblemsForma,
    // 12345: ProblemsLocal,
    // 11155111: ProblemsSepolia,
    // 17069: ProblemsGarnet,
    84532: ProblemsBaseSepolia
  }
}

import BodiesABI from './contractData/ABI-84532-Bodies.json'
// import BodiesForma from './contractData/84532-Bodies.json'
// import BodiesLocal from './contractData/84532-Bodies.json'
// import BodiesSepolia from './contractData/84532-Bodies.json'
// import BodiesGarnet from './contractData/84532-Bodies.json'
import BodiesBaseSepolia from './contractData/84532-Bodies.json'

export const Bodies = {
  abi: BodiesABI,
  networks: {
    // 80085: BodiesForma,
    // 12345: BodiesLocal,
    // 11155111: BodiesSepolia,
    // 17069: BodiesGarnet,
    84532: BodiesBaseSepolia
  }
}

import SolverABI from './contractData/ABI-84532-Solver.json'
// import SolverForma from './contractData/84532-Solver.json'
// import SolverLocal from './contractData/84532-Solver.json'
// import SolverSepolia from './contractData/84532-Solver.json'
// import SolverGarnet from './contractData/84532-Solver.json'
import SolverBaseSepolia from './contractData/84532-Solver.json'

export const Solver = {
  abi: SolverABI,
  networks: {
    // 80085: SolverForma,
    // 12345: SolverLocal,
    // 11155111: SolverSepolia,
    // 17069: SolverGarnet,
    84532: SolverBaseSepolia
  }
}

import ProblemMetadataABI from './contractData/ABI-84532-ProblemMetadata.json'
// import ProblemMetadataSepolia from './contractData/84532-ProblemMetadata.json'
// import ProblemMetadataLocal from './contractData/84532-ProblemMetadata.json'
// import ProblemMetadataGarnet from './contractData/84532-ProblemMetadata.json'
import ProblemMetadataBaseSepolia from './contractData/84532-ProblemMetadata.json'

export const ProblemMetadata = {
  abi: ProblemMetadataABI,
  networks: {
    // 11155111: ProblemMetadataSepolia,
    // 12345: ProblemMetadataLocal,
    // 17069: ProblemMetadataGarnet,
    84532: ProblemMetadataBaseSepolia
  }
}

import BodyMetadataABI from './contractData/ABI-84532-BodyMetadata.json'
// import BodyMetadataSepolia from './contractData/84532-BodyMetadata.json'
// import BodyMetadataLocal from './contractData/84532-BodyMetadata.json'
// import BodyMetadataGarnet from './contractData/84532-BodyMetadata.json'
import BodyMetadataBaseSepolia from './contractData/84532-BodyMetadata.json'

export const BodyMetadata = {
  abi: BodyMetadataABI,
  networks: {
    // 11155111: BodyMetadataSepolia,
    // 12345: BodyMetadataLocal,
    // 17069: BodyMetadataGarnet,
    84532: BodyMetadataBaseSepolia
  }
}
