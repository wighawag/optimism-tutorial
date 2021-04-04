const {loadDeploymentFromNetwork} = require('../utils');

const func = async (hre) => {
  const { deployments, getNamedAccounts } = hre
  const { execute } = deployments
  const { deployer } = await getNamedAccounts()

  const OVM_L1ERC20Gateway = await loadDeploymentFromNetwork('localhost', 'OVM_L1ERC20Gateway');
  if (!OVM_L1ERC20Gateway) {
    console.log('Skip as OVM_L1ERC20Gateway need to be deployed on l1 first');
    return;
  }

  await execute('MyL2DepositedERC20', {from: deployer}, 'init', OVM_L1ERC20Gateway.address);
}
func.tags = ['MyERC20']
module.exports = func;
