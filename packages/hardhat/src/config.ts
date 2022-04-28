import { HardhatConfig } from 'hardhat/types'

import { HardhatTypechainConfig } from './types'

export function getDefaultTypechainConfig(config: HardhatConfig): HardhatTypechainConfig {
  const defaultConfig: HardhatTypechainConfig = {
    outDir: 'typechain-types',
    target: 'ethers-v5',
    alwaysGenerateOverloads: false,
    discriminateTypes: false,
    tsNocheck: false,
  }

  return {
    ...defaultConfig,
    ...config.typechain,
  }
}
