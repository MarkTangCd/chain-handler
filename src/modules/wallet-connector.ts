import Base from './base';
import { RpcList, Networks, ChainIdByNetwork } from '../config/index';
import WalletConnectProvider from '@walletconnect/web3-provider';
import * as ethers from 'ethers';
import { provider } from '../typings/provider';
import { IAbstractConnectorOptions } from '../helpers';

class WalletConnector extends Base {

  constructor(originProvider: provider) {
    const web3Provider = new ethers.providers.Web3Provider(originProvider);
    super(originProvider, web3Provider);
  }

  disconnect() {
    this.originProvider.wc.killSession();
  }
}


export interface IWalletConnectConnectorOptions
  extends IAbstractConnectorOptions {
  infuraId?: string;
  rpc?: { [chainId: number]: string };
  bridge?: string;
  qrcode?: boolean;
  qrcodeModalOptions?: { mobileLinks?: string[] };
}
// 这里需要个Factory来创建WalletConnector
// 如果直接暴露WalletConnector给外部的话，单实例在显示QRCodeModal的时候有bug
// 暂时没事件解决，先临时这样解决一下，稍后重写成ts时候一并解决
function WcFactory(options: any, network = Networks.BSC_MAIN) {
  return new Promise(async (resolve, reject) => {
    // default options
    let bridge = "https://bridge.walletconnect.org";
    let qrcode = true;
    let infuraId = "";
    let rpc = undefined;
    let chainId = 1;
    let qrcodeModalOptions = undefined;

    if (options) {
      bridge = options.bridge || bridge;
      qrcode = typeof options.qrcode !== "undefined" ? options.qrcode : qrcode;
      infuraId = options.infuraId || "";
      rpc = options.rpc || undefined;
      chainId =
        options.network && ChainIdByNetwork[options.network] ? ChainIdByNetwork[options.network] : 56;
      qrcodeModalOptions = options.qrcodeModalOptions || undefined;
    }

    const provider = new WalletConnectProvider({
      bridge,
      qrcode,
      infuraId,
      rpc,
      chainId,
      qrcodeModalOptions
    });

    try {
      const accounts = await provider.enable();
      const walletConnector = new WalletConnector(provider);
      resolve({walletConnector, address: accounts[0]});
    } catch(err) {
      reject(err);
    }
  })
}
export default WcFactory;