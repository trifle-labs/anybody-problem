import AnybodyProblemABI from './contractData/ABI-84532-AnybodyProblem.json'
import AnybodyProblemBaseSepolia from './contractData/84532-AnybodyProblem.json'
import AnybodyProblemBase from './contractData/8453-AnybodyProblem.json'
import AnybodyProblemLocal from './contractData/12345-AnybodyProblem.json'

export const AnybodyProblem = {
  abi: AnybodyProblemABI,
  networks: {
    84532: AnybodyProblemBaseSepolia,
    12345: AnybodyProblemLocal,
    8453: AnybodyProblemBase
  }
}

import SpeedrunsABI from './contractData/ABI-84532-Speedruns.json'
import SpeedrunsBaseSepolia from './contractData/84532-Speedruns.json'
import SpeedrunsBase from './contractData/8453-Speedruns.json'
import SpeedrunsLocal from './contractData/12345-Speedruns.json'

export const Speedruns = {
  abi: SpeedrunsABI,
  networks: {
    84532: SpeedrunsBaseSepolia,
    12345: SpeedrunsLocal,
    8453: SpeedrunsBase
  }
}
