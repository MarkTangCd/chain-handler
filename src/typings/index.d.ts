type Web3Provider = | HttpProvider | WebsocketProvider | IpcProvider | AbstractProvider;

interface Window {
  ethereum: provider;
  web3: provider;
  celo: provider;
}
