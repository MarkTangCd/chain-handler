import { RpcList, Networks, ChainIdByNetwork } from '../../config/index';
import WalletConnectProvider from '@walletconnect/web3-provider';
import WalletConnectHandler from '../../modules/wallet-connect-handler';

const ConnectToWalletConnect = (options) => {
  return new Promise(async (resolve, reject) => {
    let bridge = "https://bridge.walletconnect.org";
    let qrcode = true;
    let infuraId = "";
    let rpc = RpcList;
    let chainId = ChainIdByNetwork[Networks.BSC_MAIN];
    let qrcodeModalOptions = undefined;

    if (options) {
      bridge = options.bridge || bridge;
      qrcode = typeof options.qrcode !== "undefined" ? options.qrcode : qrcode;
      infuraId = options.infuraId || "";
      chainId = options.network ? ChainIdByNetwork[options.network] : chainId;
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
      const walletConnectHandler = new WalletConnectHandler(provider);
      resolve({walletConnectHandler, accounts});
    } catch(err) {
      reject(err);
    }
  });
};

export default ConnectToWalletConnect;