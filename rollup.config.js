import { terser } from 'rollup-plugin-terser';
import cleanup from 'rollup-plugin-cleanup';
import typescript from '@rollup/plugin-typescript';
import pkg from './package.json';

const globals = {
  '@walletconnect/web3-provider': 'WalletConnectProvider',
  'ethers': 'ethers',
  'ethereumjs-util': 'ethUtil',
  '@walletconnect/utils': 'utils'
};

export default {
  input: 'src/main.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      globals
    },
    {
      file: pkg.module,
      format: 'esm',
      globals
    },
    {
      file: pkg.browser,
      format: 'umd',
      name: 'ChainHandler',
      globals
    }
  ],
  plugins: [typescript(), cleanup(), terser()],
  external: ['@walletconnect/web3-provider', '@walletconnect/utils', 'ethers', 'ethereumjs-util']
}
