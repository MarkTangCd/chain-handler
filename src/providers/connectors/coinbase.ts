import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import { ChainIdByNetwork, SupportChain } from '../../config/index';
import InjectedHandler from "../../modules/injected-handler";

interface Options {
  appName: string;
  appLogoURL: string;
  network: SupportChain;
  jsonrpcURL?: string;
}

const ConnectToCoinbase = async (options: Options) => {
  let jsonrpcURL = 'https://mainnet.infura.io/v3/a892bade64884ad6a13cf9981de659eb';
  const coinbaseWallet = new CoinbaseWalletSDK({
    appName: options.appName,
    appLogoUrl: options.appLogoURL,
    darkMode: false
  });

  if (options) {
    jsonrpcURL = options.jsonrpcURL || jsonrpcURL;
  }

  const provider = coinbaseWallet.makeWeb3Provider(jsonrpcURL, ChainIdByNetwork[options.network]);
  window.ethereum = provider;
  await provider.send('eth_requestAccounts');

  return new InjectedHandler(provider);
};

export default ConnectToCoinbase;
