import resolve from "@rollup/plugin-node-resolve";
import commonjs from '@rollup/plugin-commonjs';
import pkg from './package.json';

export default {
  input: 'src/main.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs'
    },
    {
      file: pkg.module,
      format: 'esm'
    },
    {
      file: pkg.browser,
      format: 'umd',
      name: 'ChainHandler'
    }
  ],
  plugins: [commonjs(), resolve()],
  external: ['@walletconnect/web3-provider', 'ethers']
}