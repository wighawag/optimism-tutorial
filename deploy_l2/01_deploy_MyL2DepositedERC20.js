const {ERC20} = require('../config');
const func = async (hre) => {
  const { deployments, getNamedAccounts } = hre
  const { deploy } = deployments
  const { deployer, messenger } = await getNamedAccounts()

  await deploy('MyL2DepositedERC20', {
    from: deployer,
    args: [messenger, ERC20.decimals, 'OVM_' + ERC20.name, 'ovm' + ERC20.ticker],
    log: true
  })
}

func.tags = ['MyERC20']
module.exports = func
