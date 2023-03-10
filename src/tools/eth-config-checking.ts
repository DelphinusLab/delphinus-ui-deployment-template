import { getEnabledEthConfigs } from "../config";
import { L1ClientRole } from "../types";
import Web3 from "web3";

async function main() {
    const monitorConfigs = await getEnabledEthConfigs(L1ClientRole.Monitor);
    console.log("=========================Monitor Account===========================");
    for(let i = 0; i < monitorConfigs.length; i++){
        await chainSourceCheck(monitorConfigs[i].chainName, monitorConfigs[i].rpcSource, monitorConfigs[i].privateKey);
        await chainSourceCheck(monitorConfigs[i].chainName, monitorConfigs[i].wsSource, monitorConfigs[i].privateKey);
    }
    const walletConfigs = await getEnabledEthConfigs(L1ClientRole.Wallet);
    console.log("=========================Wallet Account============================");
    for(let i = 0; i < monitorConfigs.length; i++){
        await chainSourceCheck(walletConfigs[i].chainName, walletConfigs[i].rpcSource, walletConfigs[i].privateKey);
        await chainSourceCheck(walletConfigs[i].chainName, walletConfigs[i].wsSource, walletConfigs[i].privateKey);
    }
}

async function chainSourceCheck(chainName:string, source: string, privateKey: string) {
    let web3 = await getWeb3FromSource(source);
    let address = web3.eth.accounts.privateKeyToAccount(privateKey).address;
    try {
        await web3.eth.getBalance(address, function(err, result) {  
            if (err) {
                console.log(chainName +  ": " + source +" not working");
            } else {
                console.log(chainName +  ": " + source +" works properly");
            }
        })
    }catch(err) {
        console.log(err);
    }
}

async function getWeb3FromSource(provider: string) {
    const HttpProvider = "https";
    if(provider.includes(HttpProvider)){
        return new Web3(new Web3.providers.HttpProvider(provider));
    }else {
        return new Web3(new Web3.providers.WebsocketProvider(provider));
    }
}

main().then(v => {process.exit();})
