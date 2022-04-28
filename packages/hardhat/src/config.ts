import { HardhatConfig } from 'hardhat/types'

import { HardhatTypechainConfig } from './types'

export function getDefaultTypechainConfig(config: HardhatConfig): HardhatTypechainConfig {
  // const model = {
  //   principalToken: { contract: 'Tranche.sol', schema: z.object({ xxx: z.literal('2') }) },
  // } as const

  // const generate: GenerateStatics<typeof model> = async () => ({
  //   categories: ['principalToken'],
  //   addresses: {
  //     principalToken: [randomTagAddress('principalToken')],
  //   },
  //   contracts: {
  //     principalToken: 'Tranche.sol',
  //   },
  //   metadata: {
  //     principalToken: {
  //       [randomTagAddress('principalToken')]: {
  //         xxx: '2',
  //       },
  //     },
  //   },
  // })

  // const statics: StaticsConfig = {
  //   model,
  //   generate,
  // }

  const defaultConfig: HardhatTypechainConfig = {
    outDir: 'typechain-types',
    target: 'ethers-v5',
    alwaysGenerateOverloads: false,
    discriminateTypes: false,
    tsNocheck: false,
    //statics,
  }

  return {
    ...defaultConfig,
    ...config.typechain,
  }
}
