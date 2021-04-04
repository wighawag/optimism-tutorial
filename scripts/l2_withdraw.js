const {deployments, getNamedAccounts} = require('hardhat');
const {execute} = deployments;

async function main() {

  const {testUser} = await getNamedAccounts();
  const receipt = await execute('MyL2DepositedERC20', {from: testUser, log: true}, 'withdraw', 1);
  console.log({txHash: receipt.transactionHash});
}

main().catch((e) => console.error(e));
