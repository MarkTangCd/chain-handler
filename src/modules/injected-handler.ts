import Base from "./base";
import { NOT_THE_CHAIN, UNSUPPORTED_OPERATION } from "../config/constants";
import { Networks, NetworksDetails, HandlerTypes } from "../config/index";
import { ethers } from "ethers";

class InjectedHandler extends Base {
  constructor(provider: Web3Provider) {
    const web3Provider = new ethers.providers.Web3Provider(provider);
    super(provider, web3Provider, HandlerTypes.Injected);
  }

  async getAddress() {
    try {
      let address = await this.signer.getAddress();
      return address;
    } catch (err: any) {
      if (err.code === UNSUPPORTED_OPERATION) {
        throw new Error("Please connect your wallet first");
      } else {
        console.error(err);
      }
    }
  }

  static connectWallet(callback = (address: string) => {}) {
    window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then((accounts: string[]) => {
        // This is the current account.
        callback(accounts[0]);
      })
      .catch((err: any) => {
        console.error(err.message);
      });
  }

  private async getProvider() {
    let provider = null;
    if (typeof window.ethereum !== "undefined") {
      provider = window.ethereum;
      try {
        await provider.request({ method: "eth_requestAccounts" });
      } catch (error) {
        throw new Error("User Rejected");
      }
    } else if (window.web3) {
      provider = window.web3.currentProvider;
    } else if (window.celo) {
      provider = window.celo;
    } else {
      throw new Error("No Web3 Provider found");
    }

    return provider;
  }

  switchNetwork(network: string) {
    return new Promise(async (resolve, reject) => {
      // Checking to connect status of the wallet.
      let address = await this.getAddress();
      if (!address) {
        throw new Error("Please connect your wallet first");
      }

      let values = Object.values(Networks);
      if (!network) {
        throw new Error("The param cannot be empty.");
      } else if (values.indexOf(network) === -1) {
        throw new Error("The param is wrong.");
      }

      let detail: any = NetworksDetails.find((item) => item.id === network);
      try {
        console.log("Switching network...", window.ethereum);
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: detail.config.chainId }],
        });

        // Switching networks after to need reset providers.
        let provider = await this.getProvider();
        console.log("Switched network successfully.", provider);
        const web3Provider = new ethers.providers.Web3Provider(provider);
        this.resetProviders(provider, web3Provider);

        resolve(true);
      } catch (err: any) {
        if (err.code === NOT_THE_CHAIN) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [detail.config, address],
          });
          resolve(true);
        } else {
          reject(err);
        }
      }
    });
  }
}

export default InjectedHandler;
