'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var WalletConnectProvider = require('@walletconnect/web3-provider');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var WalletConnectProvider__default = /*#__PURE__*/_interopDefaultLegacy(WalletConnectProvider);

const ethers$2 = require('ethers');

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
    const contract = new ethers$2.Contract(address, abi, this.web3Provider);
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
    const contract = new ethers$2.Contract(address, abi, this.web3Provider.getSigner());
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
    return ethers$2.utils.formatUnits(ether, num);
  }
}

// wallet error code
const NOT_THE_CHAIN = 4902;
const UNSUPPORTED_OPERATION = 'UNSUPPORTED_OPERATION';

function unique(arr) {
  if (!Array.isArray(arr)) {
    console.log('type error!');
    return
  }
  let array = [];
  for (let i = 0; i < arr.length; i++) {
    if (array.indexOf(arr[i]) === -1) {
      array.push(arr[i]);
    }
  }
  return array
}

const NetworksDetails = [
  // ETH Chain
  {
    id: 'ETH-Testnet',
    name: 'ETH Testnet',
    label: 'EHT Rinkeby Testnet',
    chainId: '0x4',
    url: 'https://ropsten.infura.io/v3/a892bade64884ad6a13cf9981de659eb',
    explorer: 'https://ropsten.etherscan.io/',
    config: {
      chainId: '0x4',
      chainName: 'ETH Testnet',
      nativeCurrency: {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
      },
      rpcUrls: [
        'https://ropsten.infura.io/v3/a892bade64884ad6a13cf9981de659eb',
      ],
      blockExplorerUrls: ['https://ropsten.etherscan.io/'],
    },
  },
  // BSC Chain
  {
    id: 'BSC-Testnet',
    name: 'BSC Testnet',
    chainId: '0x61',
    label: 'BSC Testnet',
    url: 'https://data-seed-prebsc-2-s3.binance.org:8545/',
    explorer: 'https://testnet.bscscan.com/',
    config: {
      chainId: '0x61',
      chainName: 'BSC Testnet',
      nativeCurrency: {
        name: 'BNB',
        symbol: 'BNB',
        decimals: 18,
      },
      rpcUrls: ['https://data-seed-prebsc-2-s3.binance.org:8545/'],
      blockExplorerUrls: ['https://testnet.bscscan.com/'],
    },
  },
  {
    id: 'OEC-Testnet',
    name: 'OEC Testnet',
    chainId: '0x41',
    label: 'OEC Testnet',
    url: 'https://exchaintestrpc.okex.org',
    explorer: 'https://www.oklink.com/oec-test/',
    config: {
      chainId: '0x41',
      chainName: 'OKExChain Testnet',
      nativeCurrency: {
        name: 'OKExChain Global Utility Token in testnet',
        symbol: 'OKT',
        decimals: 18,
      },
      rpcUrls: ['https://exchaintestrpc.okex.org'],
      blockExplorerUrls: ['https://www.oklink.com/okexchain-test'],
    },
  },
  // Main network
  {
    id: 'ETH-Mainnet',
    name: 'ETH Mainnet',
    chainId: '0x1',
    url: 'https://mainnet.infura.io/v3/a892bade64884ad6a13cf9981de659eb',
    explorer: 'https://etherscan.io/',
    config: {
      chainId: '0x1',
      chainName: 'ETH Mainnet',
      nativeCurrency: {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
      },
      rpcUrls: [
        'https://mainnet.infura.io/v3/a892bade64884ad6a13cf9981de659eb',
      ],
      blockExplorerUrls: ['https://etherscan.io/'],
    },
  },
  {
    id: 'BSC-Mainnet',
    name: 'BSC Mainnet',
    chainId: '0x38',
    url: 'https://bsc-dataseed.binance.org/',
    explorer: 'https://bscscan.com/',
    config: {
      chainId: '0x38',
      chainName: 'Binance Smart Chain',
      nativeCurrency: {
        name: 'BNB',
        symbol: 'BNB',
        decimals: 18,
      },
      rpcUrls: ['https://bsc-dataseed.binance.org/'],
      blockExplorerUrls: ['https://bscscan.com/'],
    },
  },
  {
    id: 'OEC-Mainnet',
    name: 'OEC Mainnet',
    chainId: '0x42',
    url: 'https://exchainrpc.okex.org',
    explorer: 'https://www.oklink.com/oec/',
    config: {
      chainId: '0x42',
      chainName: 'OKExChain Mainnet',
      nativeCurrency: {
        name: 'OKExChain Global Utility Token',
        symbol: 'OKT',
        decimals: 18,
      },
      rpcUrls: ['https://exchainrpc.okex.org'],
      blockExplorerUrls: ['https://www.oklink.com/okexchain'],
    },
  }
];
unique(NetworksDetails.map((item) => item.name.split(' ')[0]));

const Networks = Object.freeze({
  BSC_TEST: 'BSC-Testnet',
  ETH_TEST: 'ETH-Testnet',
  OEC_TEST: 'OEC-Testnet',
  BSC_MAIN: 'BSC-Mainnet',
  ETH_MAIN: 'ETH-Mainnet',
  OEC_MAIN: 'OEC-Mainnet',
});

const ChainIdByNetwork = {
  [Networks.BSC_TEST]: 97,
  [Networks.ETH_TEST]: 4,
  [Networks.OEC_TEST]: 41,
  [Networks.BSC_MAIN]: 56,
  [Networks.ETH_MAIN]: 1,
  [Networks.OEC_MAIN]: 42,
};

const RpcList = {
  [ChainIdByNetwork[Networks.BSC_TEST]]:
    'https://data-seed-prebsc-2-s3.binance.org:8545/',
  [ChainIdByNetwork[Networks.ETH_TEST]]:
    'https://ropsten.infura.io/v3/a892bade64884ad6a13cf9981de659eb',
  [ChainIdByNetwork[Networks.OEC_TEST]]: 'https://exchaintestrpc.okex.org',
  [ChainIdByNetwork[Networks.BSC_MAIN]]: 'https://bsc-dataseed.binance.org/',
  [ChainIdByNetwork[Networks.ETH_MAIN]]:
    'https://mainnet.infura.io/v3/a892bade64884ad6a13cf9981de659eb',
  [ChainIdByNetwork[Networks.OEC_TEST]]: 'https://exchainrpc.okex.org',
};

const ethers$1 = require('ethers');

class WalletHandler extends Base {

  constructor() {
    if (window.ethereum) {
      const originProvider = window.ethereum;
      const web3Provider = new ethers$1.providers.Web3Provider(originProvider);
      super(originProvider, web3Provider);
    } else {
      throw new Error('No provider exists for the current environment.');
    }
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
      });
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

const ethers = require('ethers');

class WalletConnector extends Base {

  constructor() {
    const originProvider = new WalletConnectProvider__default["default"]({
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

exports.Networks = Networks;
exports.WalletConnector = WalletConnector;
exports.WalletHandler = WalletHandler;
