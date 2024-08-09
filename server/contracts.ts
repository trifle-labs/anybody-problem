import AnybodyProblemABI from './contractData/ABI-12345-AnybodyProblem.json' // TODO: update
import AnybodyProblemBaseSepolia from './contractData/84532-AnybodyProblem.json'
import AnybodyProblemLocal from './contractData/12345-AnybodyProblem.json'
import AnybodyProblemSepolia from './contractData/11155111-AnybodyProblem.json'

export const AnybodyProblem = {
  abi: AnybodyProblemABI,
  networks: {
    84532: AnybodyProblemBaseSepolia,
    12345: AnybodyProblemLocal,
    11155111: AnybodyProblemSepolia
  }
}

import SpeedrunsABI from './contractData/ABI-12345-Speedruns.json' // TODO: update
import SpeedrunsBaseSepolia from './contractData/84532-Speedruns.json'
import SpeedrunsLocal from './contractData/12345-Speedruns.json'
import SpeedrunsSepolia from './contractData/11155111-Speedruns.json'

export const Speedruns = {
  abi: SpeedrunsABI,
  networks: {
    84532: SpeedrunsBaseSepolia,
    12345: SpeedrunsLocal,
    11155111: SpeedrunsSepolia
  }
}
