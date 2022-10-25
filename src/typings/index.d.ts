type Web3Provider = | HttpProvider | WebsocketProvider | IpcProvider | AbstractProvider;

interface Window {
  ethereum: provider;
  web3: provider;
  celo: provider;
  bitkeep: provider;
  coin98: provider;
  okxwallet: provider;
  isBitKeep: boolean;
}
