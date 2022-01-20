import WalletHandler from './modules/wallet-handler';
import WcFactory from './modules/wallet-connector';
import { Networks } from './config/index';

export {
  WalletHandler,
  WcFactory as createWalletConnect,
  Networks
}; 