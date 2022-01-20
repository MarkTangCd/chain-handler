import Base from './base';
import { RpcList, Networks, ChainIdByNetwork } from '../config/index';
import WalletConnectProvider from '@walletconnect/web3-provider';
import * as ethers from 'ethers';

class WalletConnector extends Base {

  constructor(originProvider) {
    const web3Provider = new ethers.providers.Web3Provider(originProvider);
    super(originProvider, web3Provider);
  }

  disconnect() {
    this.originProvider.wc.killSession();
  }
}

// 这里需要个Factory来创建WalletConnector
// 如果直接暴露WalletConnector给外部的话，单实例在显示QRCodeModal的时候有bug
// 暂时没事件解决，先临时这样解决一下，稍后重写成ts时候一并解决
async function WcFactory(options = {
  onSuccess: () => {},
  onFail: () => {}
}, network) {
  try {
    let values = Object.values(Networks);
    if (!network) {
      throw new Error('The param cannot be empty.');
    } else if (values.indexOf(network) === -1){
      throw new Error('The param is wrong.');
    }

    const originProvider = new WalletConnectProvider({
      rpc: RpcList,
      chainId: ChainIdByNetwork[network]
    });
  
    const accounts = await originProvider.enable();
    const walletConnector = new WalletConnector(originProvider);
    options.onSuccess(walletConnector, accounts[0]);
  } catch(err) {
    options.onFail(err.message);
  }
}
export default WcFactory;