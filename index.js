
const ProblemsABI = require('./contractData/ABI-80085-Problems.json')
const Problems = require('./contractData/80085-Problems.json')

const BodiesABI = require('./contractData/ABI-80085-Bodies.json')
const Bodies = require('./contractData/80085-Bodies.json')

const SolverABI = require('./contractData/ABI-80085-Solver.json')
const Solver = require('./contractData/80085-Solver.json')

const TocksABI = require('./contractData/ABI-80085-Tocks.json')
const Tocks = require('./contractData/80085-Tocks.json')

const Anybody = require('./src/anybody.js')
const circuits = require('./scripts/circuits')
// const utils = require('./scripts/utils')

module.exports = {
  circuits,
  // utils,
  Anybody,
  Problems: {
    abi: ProblemsABI,
    networks: {
      '80085': Problems
    },
  },
  Bodies: {
    abi: BodiesABI,
    networks: {
      '80085': Bodies
    },
  },
  Solver: {
    abi: SolverABI,
    networks: {
      '80085': Solver
    },
  },
  Tocks: {
    abi: TocksABI,
    networks: {
      '80085': Tocks
    },
  },
}