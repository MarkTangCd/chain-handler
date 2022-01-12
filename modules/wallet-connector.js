import WalletConnectProvider from '@walletconnect/web3-provider';
import { RpcList } from '../config/index';
const ethers = require('ethers');

class WalletConnector {

  constructor() {
    this.provider = null;
    this.signer = null;
    this.currentAddress = null;
    this.connector = null;

    const provider = new WalletConnectProvider({
      rpc: RpcList
    });
    this.connector = provider;
    this.provider = new ethers.providers.Web3Provider(provider);
    this.signer = this.provider.getSigner();
  }

  static getInstance() {
    if (!WalletConnector.instance) {
      WalletConnector.instance = new WalletConnector();
    }
    return WalletConnector.instance;
  }

  listenForChanges(item, callback = () => {}) {
    let items = ['chainChanged', 'accountsChanged', 'disconnect'];
    if (!item) {
      throw new Error('This listener item cannot be empty.');
    } else if (items.indexOf(item) === -1) {
      throw new Error('This listener item does not exist.');
    }

    try {
      this.connector.on(item, callback);
    } catch (err) {
      console.log('Listen to error.');
      console.log(err);
    }
  }

  async connect(options = {
    onSuccess: () => {},
    onFail: () => {}
  }) {
    try {
      let accounts = await this.connector.enable();
      this.currentAddress = accounts[0];

      options.onSuccess(accounts[0]);
    } catch(err) {
      options.onFail(err.message);
    }
  }
}

export default WalletConnector;