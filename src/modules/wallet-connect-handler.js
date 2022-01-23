import Base from './base';
import { ethers } from 'ethers';

class WalletConnectHandler extends Base {

  constructor(provider) {
    const type = 'walletconnect';
    const web3Provider = new ethers.providers.Web3Provider(provider);
    super(provider, web3Provider, type);
  }

  disconnect() {
    this.originProvider.wc.killSession();
  }
}


export default WalletConnectHandler;
