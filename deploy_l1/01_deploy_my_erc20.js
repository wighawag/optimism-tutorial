const {ERC20} = require('../config');

const func = async (hre) => {
  const { deployments, getNamedAccounts } = hre
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()

  await deploy('MyERC20', {
    from: deployer,
    args: [ERC20.decimals, ERC20.name, ERC20.ticker, ERC20.initialSupply],
    log: true
  })
}

func.tags = ['MyERC20']
module.exports = func
