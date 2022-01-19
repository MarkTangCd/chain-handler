import Base from './base';
import { RpcList } from '../config/index';
import WalletConnectProvider from '@walletconnect/web3-provider';
const ethers = require('ethers');

class WalletConnector extends Base {

  constructor() {
    const originProvider = new WalletConnectProvider({
      rpc: RpcList
    });
    const web3Provider = new ethers.providers.Web3Provider(originProvider);
    super(originProvider, web3Provider);
  }

  static getInstance() {
    if (!WalletConnector.instance) {
      WalletConnector.instance = new WalletConnector();
    }
    return WalletConnector.instance;
  }

  async connect(options = {
    onSuccess: () => {},
    onFail: () => {}
  }) {
    try {
      const accounts = await this.originProvider.enable();

      options.onSuccess(accounts[0]);
    } catch(err) {
      console.log(err);
      options.onFail(err.message);
    }
  }

  disconnect() {
    this.originProvider.wc.killSession();
  }
}

export default WalletConnector;