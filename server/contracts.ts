import ProblemsABI from '../contractData/ABI-11155111-Problems.json'
import ProblemsForma from '../contractData/80085-Problems.json'
import ProblemsLocal from '../contractData/12345-Problems.json'
import ProblemsSepolia from '../contractData/11155111-Problems.json'

export const Problems = {
  abi: ProblemsABI,
  networks: {
    80085: ProblemsForma,
    12345: ProblemsLocal,
    11155111: ProblemsSepolia
  }
}

import BodiesABI from '../contractData/ABI-11155111-Bodies.json'
import BodiesForma from '../contractData/80085-Bodies.json'
import BodiesLocal from '../contractData/12345-Bodies.json'
import BodiesSepolia from '../contractData/11155111-Bodies.json'

export const Bodies = {
  abi: BodiesABI,
  networks: {
    80085: BodiesForma,
    12345: BodiesLocal,
    11155111: BodiesSepolia
  }
}

import SolverABI from '../contractData/ABI-11155111-Solver.json'
import SolverForma from '../contractData/80085-Solver.json'
import SolverLocal from '../contractData/12345-Solver.json'
import SolverSepolia from '../contractData/11155111-Solver.json'

export const Solver = {
  abi: SolverABI,
  networks: {
    80085: SolverForma,
    12345: SolverLocal,
    11155111: SolverSepolia
  }
}

import DustABI from '../contractData/ABI-11155111-Dust.json'
import DustSepolia from '../contractData/11155111-Dust.json'
import DustLocal from '../contractData/12345-Dust.json'

export const Dust = {
  abi: DustABI,
  networks: {
    11155111: DustSepolia,
    12345: DustLocal
  }
}

import ProblemMetadataABI from '../contractData/ABI-11155111-ProblemMetadata.json'
import ProblemMetadataSepolia from '../contractData/11155111-ProblemMetadata.json'
import ProblemMetadataLocal from '../contractData/12345-ProblemMetadata.json'

export const ProblemMetadata = {
  abi: ProblemMetadataABI,
  networks: {
    11155111: ProblemMetadataSepolia,
    12345: ProblemMetadataLocal
  }
}

import BodyMetadataABI from '../contractData/ABI-11155111-BodyMetadata.json'
import BodyMetadataSepolia from '../contractData/11155111-BodyMetadata.json'
import BodyMetadataLocal from '../contractData/12345-BodyMetadata.json'

export const BodyMetadata = {
  abi: BodyMetadataABI,
  networks: {
    11155111: BodyMetadataSepolia,
    12345: BodyMetadataLocal
  }
}
