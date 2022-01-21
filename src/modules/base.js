import { convertUtf8ToHex } from "@walletconnect/utils";
import { hashPersonalMessage, recoverPublicKey } from '../helpers/index';

const ethers = require('ethers');

class Base {
  constructor(originProvider, web3Provider, type) {
    this.web3Provider = web3Provider;
    this.originProvider = originProvider;
    this.signer = web3Provider.getSigner();
    this.type = type;
  }

  /**
   * general contract method
   * @param address 
   * @param abi 
   * @param funcName : contract function name 
   * @param args : contract function params
   * @returns query result
   */
  async queryContract(address, abi,funcName,...args){
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
  async runContractTransactionFunc(address, abi, funcName,...args){
    const contract = new ethers.Contract(address, abi, this.web3Provider.getSigner());
    return contract.functions[funcName](...args)
  }

  listenForChanges(item, callback = () => {}) {
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

  verifySignature(sig, hash, address) {
    const signer = recoverPublicKey(sig, hash);
    return signer.toLowerCase() === address.toLowerCase();
  }

  async signMessage (message, address) {
    let hash = message;
    if (this.type === 'injected') hash = hashPersonalMessage(message);
    return await this.originProvider.request({ method: 'eth_sign', params: [address, hash] })
  }

  async personalSign(message, address){
    const hexMsg = convertUtf8ToHex(message);
    return this.originProvider.request({
      method: 'personal_sign',
      params: [hexMsg, address],
      from: address
    });
  }

  formatUnits(ether, num) {
    return ethers.utils.formatUnits(ether, num);
  }
}

export default Base;