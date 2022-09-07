import InjectedHandler from "../../modules/injected-handler";
import { InjectedTag } from "../../config";

export function getInjectProviderByTag(tag: InjectedTag) {
  let provider = null;
  switch (tag) {
    case InjectedTag.Metamask:
      provider = getDefaultProvider();
      break;
    case InjectedTag.BitKeep:
      provider = getBitkeepProvider();
      break;
    case InjectedTag.Coin98:
      provider = getCoin98Provider();
      break;
    default:
      provider = getDefaultProvider();
      break;
  }

  return provider;
}

async function wakeWallet(provider: any) {
  try {
    await provider.request({ method: 'eth_requestAccounts' })
  } catch (error) {
    throw new Error('User Rejected');
  }
}

function getCoin98Provider() {
  if(window.coin98){
    return window.coin98;
  }

  return window.ethereum;
}

function getBitkeepProvider() {
  if (window.isBitKeep && window.bitkeep.ethereum) {
    return window.bitkeep.ethereum;
  }
  return null;
}

function getDefaultProvider() {
  let provider = null;
  if (typeof window.ethereum !== 'undefined') {
    provider = window.ethereum;
  } else if (window.web3) {
    provider = window.web3.currentProvider;
  } else if (window.celo) {
    provider = window.celo;
  }
  return provider;
}

const ConnectToInjected = async (tag: InjectedTag = InjectedTag.Metamask) => {
  let provider = getInjectProviderByTag(tag);

  if (!provider) {
    throw new Error('No Web3 Provider found');
  }

  if (provider.hasOwnProperty && provider.hasOwnProperty('request')) {
    wakeWallet(provider);
  }

  return new InjectedHandler(provider, tag);
};

export default ConnectToInjected;
