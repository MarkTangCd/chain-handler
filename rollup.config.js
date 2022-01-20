import { terser } from 'rollup-plugin-terser';
import cleanup from 'rollup-plugin-cleanup';
import pkg from './package.json';

export default {
  input: 'src/main.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      globals: {
        '@walletconnect/web3-provider': 'WalletConnectProvider',
        'ethers': 'ethers'
      }
    },
    {
      file: pkg.module,
      format: 'esm',
      globals: {
        '@walletconnect/web3-provider': 'WalletConnectProvider',
        'ethers': 'ethers'
      }
    },
    {
      file: pkg.browser,
      format: 'umd',
      name: 'ChainHandler',
      globals: {
        '@walletconnect/web3-provider': 'WalletConnectProvider',
        'ethers': 'ethers'
      }
    }
  ],
  plugins: [cleanup(), terser()],
  external: ['@walletconnect/web3-provider', 'ethers']
}