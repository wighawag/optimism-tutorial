const hre = require('hardhat');
const {Watcher} = require('@eth-optimism/watcher');
const { JsonRpcProvider } = require('@ethersproject/providers');

const args = process.argv.slice(2);

async function main() {
  const l1Provider = new JsonRpcProvider(hre.config.networks['localhost'].url)
  const l2Provider = new JsonRpcProvider(hre.config.networks['optimism'].url)

  const l1MessengerAddress = hre.config.namedAccounts['messenger']['localhost'];
  const l2MessengerAddress = hre.config.namedAccounts['messenger']['optimism'];

  const watcher = new Watcher({
    l1: {
      provider: l1Provider,
      messengerAddress: l1MessengerAddress
    },
    l2: {
      provider: l2Provider,
      messengerAddress: l2MessengerAddress
    }
  })

  const [l1ToL2msgHash] = await watcher.getMessageHashesFromL1Tx(args[0]);
	console.log('got L1->L2 message hash', l1ToL2msgHash)
	const l2Receipt = await watcher.getL2TransactionReceipt(l1ToL2msgHash)
  console.log('completed Deposit! L2 tx hash:', l2Receipt.transactionHash)

}

main().catch((e) => console.error(e));
