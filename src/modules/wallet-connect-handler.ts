import Base from './base';
import { ethers } from 'ethers';
import { HandlerTypes } from '../config';

class WalletConnectHandler extends Base {

  constructor(provider: Web3Provider) {
    const web3Provider = new ethers.providers.Web3Provider(provider);
    super(provider, web3Provider, HandlerTypes.WalletConnect);
  }

  disconnect() {
    this.originProvider.wc.killSession();
  }
}


export default WalletConnectHandler;
