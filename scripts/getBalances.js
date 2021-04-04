const hre = require('hardhat');
const { JsonRpcProvider } = require('@ethersproject/providers');
const { Contract } = require('@ethersproject/contracts');
const {loadDeploymentFromNetwork} = require('../utils');

async function main() {
  const l1Provider = new JsonRpcProvider(hre.config.networks['localhost'].url)
  const l2Provider = new JsonRpcProvider(hre.config.networks['optimism'].url)


  const {testUser} = await hre.getNamedAccounts();

  const MyERC20 = await loadDeploymentFromNetwork('localhost', 'MyERC20');
  const MyERC20Contract = new Contract(MyERC20.address, MyERC20.abi, l1Provider);
  const balance = await MyERC20Contract.callStatic.balanceOf(testUser);
  console.log({MyERC20: balance.toString()});


  const MyL2DepositedERC20 = await loadDeploymentFromNetwork('optimism', 'MyL2DepositedERC20');
  const MyL2DepositedERC20Contract = new Contract(MyL2DepositedERC20.address, MyL2DepositedERC20.abi, l2Provider);
  const balance2 = await MyL2DepositedERC20Contract.callStatic.balanceOf(testUser, {gasLimit: 1000000, gasPrice: 0});
  console.log({MyL2DepositedERC20: balance2.toString()});

}

main().catch((e) => console.error(e));
