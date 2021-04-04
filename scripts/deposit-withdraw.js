const { Web3Provider } = require('@ethersproject/providers');
const {Watcher} = require('@eth-optimism/watcher');
const {deployments, getNamedAccounts, companionNetworks, network} = require('hardhat');
const {execute} = deployments;

async function showBalance(testUser) {
  const balance = await companionNetworks.l1.deployments.read('MyERC20', 'balanceOf', testUser);
  console.log({MyERC20: balance.toString()});
  const balance2 = await deployments.read('MyL2DepositedERC20', 'balanceOf', testUser);
  console.log({MyL2DepositedERC20: balance2.toString()});
}

async function main() {

  const {messenger: l1MessengerAddress} = await companionNetworks.l1.getNamedAccounts();
  const {messenger: l2MessengerAddress, testUser} = await getNamedAccounts();

  const watcher = new Watcher({
    l1: {
      provider: new Web3Provider(companionNetworks.l1.provider),
      messengerAddress: l1MessengerAddress
    },
    l2: {
      provider: new Web3Provider(network.provider),
      messengerAddress: l2MessengerAddress
    }
  })

  await showBalance(testUser);

  const OVM_L1ERC20Gateway = await companionNetworks.l1.deployments.get('OVM_L1ERC20Gateway');
  await companionNetworks.l1.deployments.execute('MyERC20', {from: testUser, log: true}, 'approve', OVM_L1ERC20Gateway.address, 1);
  const receipt = await companionNetworks.l1.deployments.execute('OVM_L1ERC20Gateway', {from: testUser, log: true}, 'deposit', 1);
  console.log({txHash: receipt.transactionHash});

  await showBalance(testUser);

  const [l1ToL2msgHash] = await watcher.getMessageHashesFromL1Tx(receipt.transactionHash);
	console.log('got L1->L2 message hash', l1ToL2msgHash)
	const l2Receipt = await watcher.getL2TransactionReceipt(l1ToL2msgHash)
  console.log('completed Deposit! L2 tx hash:', l2Receipt.transactionHash)

  await showBalance(testUser);

  const receipt2 = await execute('MyL2DepositedERC20', {from: testUser, log: true}, 'withdraw', 1);
  console.log({txHash: receipt2.transactionHash});

  await showBalance(testUser);

  const [l2ToL1msgHash] = await watcher.getMessageHashesFromL2Tx(receipt2.transactionHash)
  console.log('got L2->L1 message hash', l2ToL1msgHash)
  const l1Receipt = await watcher.getL1TransactionReceipt(l2ToL1msgHash)
  console.log('completed Withdrawal! L1 tx hash:', l1Receipt.transactionHash)

  await showBalance(testUser);
}

main().catch((e) => console.error(e));
