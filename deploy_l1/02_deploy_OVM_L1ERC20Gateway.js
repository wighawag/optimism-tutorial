const { getContractDefinition } = require('@eth-optimism/contracts');
const {loadDeploymentFromNetwork} = require('../utils');

const func = async (hre) => {
    const { deployments, getNamedAccounts } = hre
    const { deploy } = deployments
    const { deployer, messenger } = await getNamedAccounts()
    const OVM_L1ERC20Gateway = getContractDefinition('OVM_L1ERC20Gateway');

    const MyERC20 = await deployments.get('MyERC20');

    const MyL2DepositedERC20 = await loadDeploymentFromNetwork('optimism', 'MyL2DepositedERC20');
    if (!MyL2DepositedERC20) {
        console.log('Skip as MyL2DepositedERC20 need to be deployed on l2 first');
        return;
    }

    await deploy('OVM_L1ERC20Gateway', {
      from: deployer,
      contract: OVM_L1ERC20Gateway,
      args: [MyERC20.address, MyL2DepositedERC20.address, messenger],
      log: true
    })
  }
  
  func.tags = ['OVM_L1ERC20Gateway']
  module.exports = func
  
