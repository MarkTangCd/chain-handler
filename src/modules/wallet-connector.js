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
      let accounts = await this.originProvider.enable();

      this.originProvider.on('disconnect', async(code, reason) => {
        console.log(code, reason);
      });

      options.onSuccess(accounts[0]);
    } catch(err) {
      console.log(err);
      options.onFail(err.message);
    }
  }

  disconnect() {
    this.originProvider.wc.killSession();
  }

  switchNetwork() {
    this.originProvider.wc.updateSession({
      chainId: 1,
      accounts: ['0xDA543d0C58E38f5645E0Af1EbE12345d7B6B89F7']
    });
  }
}

export default WalletConnector;