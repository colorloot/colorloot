import { join } from "path";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-etherscan";
import "hardhat-abi-exporter";
import "hardhat-gas-reporter";

import { HardhatUserConfig } from "hardhat/config";

import * as dotenv from "dotenv";
dotenv.config({ path: join(__dirname, ".env") });

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      loggingEnabled: true,
      chainId: 31337
    },
    mainnet: {
      url: "https://mainnet.infura.io/v3/d90e0fe6c2cb4e7b92fcfa9759b46bc7",
      accounts: [process.env.TEST_ACCOUNT!],
    },
    kovan: {
      url: "https://kovan.infura.io/v3/1eac7db4d3e347f5b80b40ab40542e91",
      accounts: [process.env.TEST_ACCOUNT!],
    },
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/1eac7db4d3e347f5b80b40ab40542e91",
      accounts: [process.env.TEST_ACCOUNT!],
    },
    heco_test: {
      url: "https://http-testnet.hecochain.com",
      accounts: [process.env.TEST_ACCOUNT!],
    },
    bsc_test: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      accounts: [process.env.TEST_ACCOUNT!],
    },
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  abiExporter: {
    clear: true,
    flat: true,
    only: [
      "ColorLoot",
      "MockLoot",
      "MockAvatars",
    ],
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};
export default config;
