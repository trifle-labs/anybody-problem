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

// import AnybodyProblemV0Base from './contractData/8453-AnybodyProblemV0.json'
// import AnybodyProblemV0BaseSepolia from './contractData/84532-AnybodyProblemV0.json'
import AnybodyProblemV0Local from './contractData/12345-AnybodyProblemV0.json'
import AnybodyProblemV0ABI from './contractData/ABI-12345-AnybodyProblemV0.json'

export const AnybodyProblemV0 = {
  abi: AnybodyProblemV0ABI,
  networks: {
    // 8453: AnybodyProblemV0Base,
    // 84532: AnybodyProblemV0BaseSepolia,
    12345: AnybodyProblemV0Local
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
