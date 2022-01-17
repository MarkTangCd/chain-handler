import Base from './base';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { RpcList } from '../config/index';
const ethers = require('ethers');

class WalletConnector extends Base {

  constructor() {
    const wcProvider = new WalletConnectProvider({
      rpc: RpcList
    });
    const provider = new ethers.providers.Web3Provider(wcProvider);
    super(provider);
    this.currentAddress = null;
    this.connector = wcProvider;
    this.provider = provider;
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
      console.log(this.currentAddress);

      options.onSuccess(accounts[0]);
    } catch(err) {
      console.log(err)
      options.onFail(err.message);
    }
  }

  async signMessage (message) {
    return await this.connector.request({ method: 'eth_sign', params: [this.currentAddress, message] })
  }

  async personalSign(message){
    throw new Error('please use signMessage for ConnectWallet.')
  }
}

export default WalletConnector;