require('@nomiclabs/hardhat-ethers')
require('@nomiclabs/hardhat-waffle')
require('hardhat-deploy')
require('@eth-optimism/plugins/hardhat/compiler')
const hdnode = require('@ethersproject/hdnode');

module.exports = {
  networks: {
    hardhat: {
      accounts: {
        mnemonic: 'test test test test test test test test test test test junk'
      },
      deploy: ["deploy_l1"]
    },
    optimism: {
      url: 'http://127.0.0.1:8545',
      accounts: {
        mnemonic: 'test test test test test test test test test test test junk'
      },
      deploy: ["deploy_l2"],
      ovm: true
    },
    localhost: {
      url: 'http://127.0.0.1:9545',
      // copy settings from https://github.com/ethereum-optimism/hardhat/blob/5c5ca2ca05a26dbb59f5a5b8cdabf010ec7ca5b7/hardhat.config.js
      accounts: {
        mnemonic: 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
        path: hdnode.defaultPath,
        count: 8,
        gasPrice: 0,
        gasLimit: 0x1fffffffffffff,
      },
      deploy: ["deploy_l1"]
    }
  },
  solidity: '0.7.6',
  ovm: {
    solcVersion: '0.7.6'
  },
  namedAccounts: {
    deployer: 0,
    messenger: {
      optimism: '0x4200000000000000000000000000000000000007',
      localhost: '0x6418E5Da52A3d7543d393ADD3Fa98B0795d27736'
    },
    testUser: 'privatekey://0xf14a6e4b68641b84ebef1c0f73cde544348429fe135272e111b946b38d329e16' // for test
  },
}
