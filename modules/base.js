const ethers = require('ethers');

class Base {
  constructor(provider) {
    this.provider = provider;
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
    const contract = new ethers.Contract(address, abi, this.provider);
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
    const contract = new ethers.Contract(address, abi, this.provider.getSigner());
    return contract.functions[funcName](...args)
  }

  formatUnits(ether, num) {
    return ethers.utils.formatUnits(ether, num);
  }
}

export default Base;