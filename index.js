

import ProblemsABI from './contractData/ABI-80085-Problems.json'
import Problems from './contractData/80085-Problems.json'
import ProblemsLocal from './contractData/12345-Problems.json'

import BodiesABI from './contractData/ABI-80085-Bodies.json'
import Bodies from './contractData/80085-Bodies.json'
import BodiesLocal from './contractData/12345-Bodies.json'

import SolverABI from './contractData/ABI-80085-Solver.json'
import Solver from './contractData/80085-Solver.json'
import SolverLocal from './contractData/12345-Solver.json'

import TocksABI from './contractData/ABI-80085-Tocks.json'
import Tocks from './contractData/80085-Tocks.json'
import TocksLocal from './contractData/12345-Tocks.json'

import MetadataABI from './contractData/ABI-80085-Metadata.json'
import Metadata from './contractData/80085-Metadata.json'
import MetadataLocal from './contractData/12345-Metadata.json'

import Anybody from './src/anybody.js'
import circuits from './scripts/circuits'
// const utils = require('./scripts/utils')


const exported = {
  circuits,
  // utils,
  Anybody,
  Problems: {
    abi: ProblemsABI,
    networks: {
      '80085': Problems,
      '12345': ProblemsLocal
    },
  },
  Bodies: {
    abi: BodiesABI,
    networks: {
      '80085': Bodies,
      '12345': BodiesLocal
    },
  },
  Solver: {
    abi: SolverABI,
    networks: {
      '80085': Solver,
      '12345': SolverLocal
    },
  },
  Tocks: {
    abi: TocksABI,
    networks: {
      '80085': Tocks,
      '12345': TocksLocal
    },
  },
  Metadata: {
    abi: MetadataABI,
    networks: {
      '80085': Metadata,
      '12345': MetadataLocal
    },
  },
}
export default exported
// module.exports = exported