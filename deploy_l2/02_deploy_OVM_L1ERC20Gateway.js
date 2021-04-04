const { getContractDefinition } = require('@eth-optimism/contracts');

const func = async (hre) => {
    // Layer 1
    const { deployments, getNamedAccounts } = hre.companionNetworks['l1'];
    const { deploy } = deployments;
    const { deployer, messenger } = await getNamedAccounts();

    const MyERC20 = await deployments.get('MyERC20');
    const MyL2DepositedERC20 = await hre.deployments.get('MyL2DepositedERC20'); // from Layer 2

    const OVM_L1ERC20Gateway = getContractDefinition('OVM_L1ERC20Gateway');
    await deploy('OVM_L1ERC20Gateway', {
      from: deployer,
      contract: OVM_L1ERC20Gateway,
      args: [MyERC20.address, MyL2DepositedERC20.address, messenger],
      log: true
    });
  }

  func.tags = ['MyL2DepositedERC20', 'OVM_L1ERC20Gateway']
  module.exports = func

