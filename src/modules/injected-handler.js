import Base from './base';
import { NOT_THE_CHAIN, UNSUPPORTED_OPERATION } from '../config/constants';
import { Networks, NetworksDetails } from '../config/index';
import * as ethers from 'ethers';

class InjectedHandler extends Base {
  constructor(provider) {
    const type = 'injected';
    const web3Provider = new ethers.providers.Web3Provider(provider);
    super(provider, web3Provider, type);
  }

  async getAddress() {
    try {
      let address = await this.signer.getAddress();
      return address;
    } catch(err) {
      if (err.code === UNSUPPORTED_OPERATION) {
        throw new Error('Please connect your wallet first');
      } else {
        console.error(err);
      }
    }
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
          params: [detail.config, address]
        });
        callback();
      } else {
        console.error(err);
      }
    }
  }
}

export default InjectedHandler;