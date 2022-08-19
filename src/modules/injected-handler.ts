import { ethers } from "ethers";
import Base from "./base";
import { NOT_THE_CHAIN, UNSUPPORTED_OPERATION } from "../config/constants";
import { Networks, NetworksDetails, HandlerTypes, SupportChain, InjectedTag } from "../config/index";
import { getInjectProviderByTag } from '../providers/connectors/injected';

class InjectedHandler extends Base {
  tag: InjectedTag;

  constructor(provider: Web3Provider, tag: InjectedTag = InjectedTag.Metamask) {
    const web3Provider = new ethers.providers.Web3Provider(provider);
    super(provider, web3Provider, HandlerTypes.Injected);
    this.tag = tag;
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

  switchNetwork(network: SupportChain) {
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
        console.log("Switching network...", this.originProvider);
        await this.originProvider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: detail.config.chainId }],
        });

        // Switching networks after to need reset providers.
        let provider = getInjectProviderByTag(this.tag);
        console.log("Switched network successfully.", provider);
        const web3Provider = new ethers.providers.Web3Provider(provider);
        this.resetProviders(provider, web3Provider);

        resolve(true);
      } catch (err: any) {
        if (err.code === NOT_THE_CHAIN) {
          await this.originProvider.request({
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
