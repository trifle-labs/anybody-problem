
const ProblemsABI = require('./contractData/ABI-80085-Problems.json')
const Problems = require('./contractData/80085-Problems.json')
const ProblemsLocal = require('./contractData/12345-Problems.json')

const BodiesABI = require('./contractData/ABI-80085-Bodies.json')
const Bodies = require('./contractData/80085-Bodies.json')
const BodiesLocal = require('./contractData/12345-Bodies.json')

const SolverABI = require('./contractData/ABI-80085-Solver.json')
const Solver = require('./contractData/80085-Solver.json')
const SolverLocal = require('./contractData/12345-Solver.json')

const TocksABI = require('./contractData/ABI-80085-Tocks.json')
const Tocks = require('./contractData/80085-Tocks.json')
const TocksLocal = require('./contractData/12345-Tocks.json')

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
}