import Base from './base';
import { NOT_THE_CHAIN, UNSUPPORTED_OPERATION } from '../config/constants';
import { Networks, NetworksDetails } from '../config/index';
const ethers = require('ethers');

class WalletHandler extends Base {

  constructor() {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      super(provider);
      this.currentAddress = null;
      this.provider = provider;
      this.signer = this.provider.getSigner();
      this._init();
    } else {
      throw new Error('No provider exists for the current environment.');
    }
  }

  async _init() {
    this.getAddress();
  }

  async getAddress() {
    try {
      let address = await this.signer.getAddress();
      this.currentAddress = address;
      return address;
    } catch(err) {
      if (err.code === UNSUPPORTED_OPERATION) {
        throw new Error('Please connect your wallet first');
      } else {
        console.error(err);
      }
    }
  }

  static getInstance() {
    if (!WalletHandler.instance) {
      WalletHandler.instance = new WalletHandler();
    }
    return WalletHandler.instance;
  }

  static connectWallet(callback = () => {}) {
    window.ethereum.request({ method: 'eth_requestAccounts' })
      .then(accounts => {
        // This is the current account.
        callback(accounts[0]);
      })
      .catch(err => {
        console.error(err.message);
      });
  }

  listenForChanges(item, callback = () => {}) {
    let items = ['chainChanged', 'accountsChanged'];
    if (!item) {
      throw new Error('This listener item cannot be empty.');
    } else if (items.indexOf(item) === -1) {
      throw new Error('This listener item does not exist.');
    }

    try {
      window.ethereum.on(item, callback);
    } catch (err) {
      console.log('Listen to error.');
      console.log(err);
    }
  }

  async switchNetwork(network, callback = () => {}) {
    // Checking to connect status of the wallet.
    let address = await this.getAddress();
    if (!address) {
      throw new Error('Please connect your wallet first');
    }

    let values = Object.values(Networks);
    if (!network) {
      throw new Error('The param cannot be empty.');
    } else if (values.indexOf(network) === -1){
      throw new Error('The param is wrong.');
    }

    let detail = NetworksDetails.find((item) => item.id === network);
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{chainId: detail.config.chainId}]
      })
      callback();
    } catch (err) {
      if (err.code === NOT_THE_CHAIN) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [detail.config, this.currentAddress]
        });
        callback();
      } else {
        console.error(err);
      }
    }
  }

  async signMessage(message) {
    return window.ethereum.request({ method: 'eth_sign', params: [this.currentAddress, message] });
  }

  async personalSign(message){
    return window.ethereum.request({
      method: 'personal_sign',
      params: [message, this.currentAddress],
      from: this.currentAddress
    });
  }
}

export default WalletHandler;