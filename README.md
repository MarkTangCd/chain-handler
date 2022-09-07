# ChainHandler

This is the operation library of Smart Contract and Wallet.

## Usage

1. Install ChainHandler NPM package

```bash
npm install --save chain-handler

# OR

yarn add chain-handler
```

2. Then you can add ChainHandler to your Dapp as follows

```js
import { ConnectToInjected, ConnectToCoinbase, ConnectToWalletConnect, Networks, InjectedTag } from 'chain-handler';

// Initialization InjectedHandler
let injectedHandler = ConnectToInjected();
// BitKeep Wallet
let injectedHandler = ConnectToInjected(InjectedTag.BitKeep);
// Coin98 Wallet
let injectedHandler = ConnectToInjected(InjectedTag.Coin98);
// if it's Coinbase
let injectedHandler = ConnectToCoinbase({
  appName: 'your app name',
  appLogoURL: 'http://xxxxx.xxx/xxx.png',
  network: Networks.ETH_MAIN,
  jsonrpcURL: 'your infura url' // optional
});
// Initialization is successful after.
// Get the latest wallet address.
let address = await injectedHandler.getAddress();

// Switch networks
injectedHandler.switchNetwork(Networks.BSC_MAIN); // BSC main net
injectedHandler.switchNetwork(Networks.ETH_MAIN); // ETH main net
injectedHandler.switchNetwork(Networks.OEC_MAIN); // OEC main net
injectedHandler.switchNetwork(Networks.ETH_GOERLI); // Ethereum Testnet Görli

// listen for changes
injectedHandler.listenForChanges('chainChanged', () => {console.log('network changed')});
injectedHandler.listenForChanges('accountsChanged', () => {console.log('account changed')});

// Initialization WalletConnectHandler
const options = {
  bridge?: string,
  qrcode?: bool,
  infuraid?: string,
  network: Networks,
  qrcodeModalOptions?: object
};

let walletConnectHandler;
ConnectToWalletConnect(options)
  .then((res) => {
    walletConnectHandler = res.walletConnectHandler;
    console.log(res.walletConnectHandler);
    console.log(res.address);
  })
  .catch(err => console.error(err));

// listen for changes
walletConnectHandler.listenForChanges('accountsChanged', (accounts) => {});
walletConnectHandler.listenForChanges('chainChanged', (chainId) => {});
walletConnectHandler.listenForChanges('disconnect', (code, reason) => {});

// Disconnect the Wallet Connect.
walletConnectHandler.disconnect();

// Both has some functions too.

async queryContract(address, abi,funcName,...args);

async runContractTransactionFunc(address, abi, funcName,...args);

async signMessage(message, toBytes = false);

formatUnits(ether, num);

```

## License

MIT
