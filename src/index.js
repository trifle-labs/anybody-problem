export { Anybody } from './anybody.js'
export * as circuits from '../scripts/circuits.js'
// const utils = require('../scripts/utils')

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

import TocksABI from '../contractData/ABI-11155111-Tocks.json'
import TocksForma from '../contractData/80085-Tocks.json'
import TocksLocal from '../contractData/12345-Tocks.json'
import TocksSepolia from '../contractData/11155111-Tocks.json'

export const Tocks = {
	abi: TocksABI,
	networks: {
		80085: TocksForma,
		12345: TocksLocal,
		11155111: TocksSepolia
	}
}

import MetadataABI from '../contractData/ABI-11155111-Metadata.json'
import MetadataForma from '../contractData/80085-Metadata.json'
import MetadataLocal from '../contractData/12345-Metadata.json'
import MetadataSepolia from '../contractData/11155111-Metadata.json'

export const Metadata = {
	abi: MetadataABI,
	networks: {
		80085: MetadataForma,
		12345: MetadataLocal,
		11155111: MetadataSepolia
	}
}

// export default {
//   Anybody,
//   // circuits,
//   Problems,
//   Bodies,
//   Solver,
//   Tocks,
//   Metadata
// }
