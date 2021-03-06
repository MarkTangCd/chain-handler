import { recoverPublicKey } from '../helpers/index';
import { ethers } from 'ethers';
import { HandlerTypes } from '../config';

class Base {
  originProvider: Web3Provider;
  web3Provider: ethers.providers.Web3Provider;
  signer: ethers.Signer;
  type: HandlerTypes

  constructor(originProvider: Web3Provider, web3Provider: ethers.providers.Web3Provider, type: HandlerTypes) {
    this.web3Provider = web3Provider;
    this.originProvider = originProvider;
    this.signer = web3Provider.getSigner();
    this.type = type;
  }

  protected resetProviders(originProvider: Web3Provider, web3Provider: ethers.providers.Web3Provider) {
    this.originProvider = originProvider;
    this.web3Provider = web3Provider;
    this.signer = web3Provider.getSigner();
  }

  /**
   * general contract method
   * @param address
   * @param abi
   * @param funcName : contract function name
   * @param args : contract function params
   * @returns query result
   */
  async queryContract(address: string, abi: any,funcName: string,...args: any){
    const contract = new ethers.Contract(address, abi, this.web3Provider);
    return contract.functions[funcName](...args)
  }

  /**
   * general contract method
   * @param address
   * @param abi
   * @param funcName : contract function name
   * @param args : contract function params
   * @returns contract function execute result
   */
  async runContractTransactionFunc(address: string, abi: any, funcName: string,...args: any){
    const contract = new ethers.Contract(address, abi, this.web3Provider.getSigner());
    return contract.functions[funcName](...args)
  }

  listenForChanges(item: string, callback = () => {}) {
    let items = ['chainChanged', 'accountsChanged', 'disconnect'];
    if (!item) {
      throw new Error('This listener item cannot be empty.');
    } else if (items.indexOf(item) === -1) {
      throw new Error('This listener item does not exist.');
    }

    try {
      this.originProvider.on(item, callback);
    } catch (err) {
      console.log('Listen to error.');
      console.log(err);
    }
  }

  verifySignature(sig: string, hash: string, address: string) {
    const signer = recoverPublicKey(sig, hash);
    return signer.toLowerCase() === address.toLowerCase();
  }

  async signMessage (message: string | ethers.utils.Bytes, toBytes = false) {
    if (toBytes === true) {
      message = ethers.utils.arrayify(message);
    }
    const signature = await this.signer.signMessage(message);
    return signature;
  }

  formatUnits(ether: ethers.BigNumberish, num?: ethers.BigNumberish | undefined) {
    return ethers.utils.formatUnits(ether, num);
  }
}

export default Base;
