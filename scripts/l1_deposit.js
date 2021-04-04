const {deployments, getNamedAccounts} = require('hardhat');
const {execute} = deployments;

async function main() {
  const {testUser} = await getNamedAccounts();

  const OVM_L1ERC20Gateway = await deployments.get('OVM_L1ERC20Gateway');
  await execute('MyERC20', {from: testUser, log: true}, 'approve', OVM_L1ERC20Gateway.address, 1);
  const receipt = await execute('OVM_L1ERC20Gateway', {from: testUser, log: true}, 'deposit', 1);
  console.log({txHash: receipt.transactionHash});
}

main().catch((e) => console.error(e));
