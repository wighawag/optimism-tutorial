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

  const [l2ToL1msgHash] = await watcher.getMessageHashesFromL2Tx(args[0])
  console.log('got L2->L1 message hash', l2ToL1msgHash)
  const l1Receipt = await watcher.getL1TransactionReceipt(l2ToL1msgHash)
  console.log('completed Withdrawal! L1 tx hash:', l1Receipt.transactionHash)
}

main().catch((e) => console.error(e));
