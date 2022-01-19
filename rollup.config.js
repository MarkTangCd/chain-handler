import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import pkg from './package.json';

export default {
  input: 'src/main.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      globals: {
        '@walletconnect/web3-provider': 'WalletConnectProvider'
      }
    },
    {
      file: pkg.module,
      format: 'esm',
      globals: {
        '@walletconnect/web3-provider': 'WalletConnectProvider'
      }
    },
    {
      file: pkg.browser,
      format: 'umd',
      name: 'ChainHandler',
      globals: {
        '@walletconnect/web3-provider': 'WalletConnectProvider'
      }
    }
  ],
  plugins: [json(), commonjs()],
  external: ['@walletconnect/web3-provider', 'ethers']
}