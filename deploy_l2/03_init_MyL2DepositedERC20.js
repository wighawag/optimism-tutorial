const func = async (hre) => {
  const { deployments, getNamedAccounts } = hre
  const { execute } = deployments
  const { deployer } = await getNamedAccounts()

  const OVM_L1ERC20Gateway = await hre.companionNetworks['l1'].deployments.get('OVM_L1ERC20Gateway'); // layer 1

  await execute('MyL2DepositedERC20', {from: deployer, log: true}, 'init', OVM_L1ERC20Gateway.address);
}
func.tags = ['MyL2DepositedERC20', 'MyL2DepositedERC20_init']
module.exports = func;
