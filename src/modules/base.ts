const ethers = require('ethers');

class Base {
  constructor(originProvider, web3Provider) {
    this.web3Provider = web3Provider;
    this.originProvider = originProvider;
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

  async signMessage (message, address) {
    return await this.originProvider.request({ method: 'eth_sign', params: [address, message] })
  }

  async personalSign(message, address){
    return this.originProvider.request({
      method: 'personal_sign',
      params: [message, address],
      from: address
    });
  }

  formatUnits(ether, num) {
    return ethers.utils.formatUnits(ether, num);
  }
}

export default Base;