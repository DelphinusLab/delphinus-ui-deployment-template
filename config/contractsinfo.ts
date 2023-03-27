export const contractsInfo = require("./contracts-info.json");

export const Chains : Record<string, string> = {
    "15": "local-test-net1",
    "16": "local-test-net2",
    "5":  "goerli",
    "97":  "bsctestnet",
    "7701": "cantotestnet",
    "2814": "rolluxtestnet"
}

export const extraTokens = [
  {
    chainId: "97",
    name: "usdt",
    wei: 18,
    address: "337610d27c682E347C9cD60BD4b3b107C9d34dDd"
  },
  {
    chainId: "97",
    name: "usdc",
    wei: 18,
    address: "64544969ed7EBf5f083679233325356EbE738930"
  },
  {
    chainId: "5",
    name: "usdt",
    wei: 6,
    address: "c81c248c44e96D85a0eCddc104843cE55B1ff35c"
  },
  {
    chainId: "5",
    name: "usdc",
    wei: 6,
    address: "07865c6E87B9F70255377e024ace6630C1Eaa37F"
  }
]
