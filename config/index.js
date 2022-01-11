function unique(arr) {
  if (!Array.isArray(arr)) {
    console.log('type error!')
    return
  }
  let array = []
  for (let i = 0; i < arr.length; i++) {
    if (array.indexOf(arr[i]) === -1) {
      array.push(arr[i])
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
    chainId: '0x42',
    label: 'OEC Testnet',
    url: 'https://exchaintestrpc.okex.org',
    explorer: 'https://www.oklink.com/oec-test/',
    config: {
      chainId: '0x42',
      chainName: 'OEC Testnet',
      nativeCurrency: {
        name: 'OKT',
        symbol: 'OKT',
        decimals: 18,
      },
      rpcUrls: ['https://exchaintestrpc.okex.org'],
      blockExplorerUrls: ['https://www.oklink.com/oec-test/'],
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
      chainName: 'OEC Mainnet',
      nativeCurrency: {
        name: 'OKT',
        symbol: 'OKT',
        decimals: 18,
      },
      rpcUrls: ['https://exchainrpc.okex.org'],
      blockExplorerUrls: ['https://www.oklink.com/oec/'],
    },
  },
]
const Chains = unique(NetworksDetails.map((item) => item.name.split(' ')[0]))

const Networks = Object.freeze({
  BSC_TEST: 'BSC-Testnet',
  ETH_TEST: 'ETH-Testnet',
  OEC_TEST: 'OEC-Testnet',
  BSC_MAIN: 'BSC-Mainnet',
  ETH_MAIN: 'ETH-Mainnet',
  OEC_MAIN: 'OEC-Mainnet'
});

export { NetworksDetails, Networks, Chains }
