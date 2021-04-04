const { parseEther } = require('@ethersproject/units');
const {deployments, getNamedAccounts} = require('hardhat');
const {rawTx, execute} = deployments;

async function main() {

  const {deployer, testUser} = await getNamedAccounts();
  await rawTx({from: deployer, to: testUser, log: true, value: parseEther("1")});
  await execute('MyERC20', {from: deployer, log: true}, 'transfer', testUser, 1);
}

main().catch((e) => console.error(e));
