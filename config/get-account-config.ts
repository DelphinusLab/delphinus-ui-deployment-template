import { Keyring } from "@polkadot/api";
import { cryptoWaitReady } from "@polkadot/util-crypto";
import { getEthConfigs } from "../src/config"
import { L1ClientRole } from "../src/types";
const ss58 = require("substrate-ss58");
const accountConfig = require("./substrate-account-config.json");

// output messages to the web console for generate-config.sh in substrate-node repo
async function getAccountConfig() {
  await cryptoWaitReady();
  const keyring = new Keyring({ type: "sr25519" });
  let regExp = new RegExp("/","g");

  // generate admins in substrate runtime
  let secretKeyUri = accountConfig.secret_key_uri;
  let admins = "vec![";
  for(var i = 0; i < secretKeyUri.length; i++) {
    let pubKey = ss58.addressToAddressId(keyring.addFromUri(secretKeyUri[i]).address);
    if(i != secretKeyUri.length - 1) {
      admins = admins + "AccountId::from(hex_literal::hex![\"" + pubKey.slice(2) + "\"]),";
    } else {
      admins = admins + "AccountId::from(hex_literal::hex![\"" + pubKey.slice(2) + "\"])]";
    }
  }

  // generate enabled_string
  // for example, nack = 1111(15) means 4 networks in eth-config.ts should emit ack function in substrate node
  // if we want to deprecate the 4th network, set enabled in eth-config.ts to dev, the nack is 111(7) now
  let enabled_arr = new Array(secretKeyUri.length).fill("0");
  let configs = await getEthConfigs(L1ClientRole.Monitor);
  for(let i = 0; i < configs.length; i++) {
    if(configs[i].enabled == true) {
      let index = secretKeyUri.indexOf(configs[i].l2Account);
      enabled_arr[index] = "1";
    }
  }
  let nack = parseInt(enabled_arr.reverse().join().replace(/,/g, ""), 2);
  let enabled_string = "let nack = " + nack + "u8;";

  // generate authorities_seeds for initial PoA authorities
  let authSeeds = accountConfig.authorities_seeds;
  let authorities_seeds = "authorities_seeds: \\&[";
  for(var i = 0; i <authSeeds.length; i++) {
    if(i != authSeeds.length - 1) {
      authorities_seeds = authorities_seeds + "\"" + authSeeds[i].replace(regExp, "\\/") + "\",";
    } else 
      authorities_seeds = authorities_seeds + "\"" + authSeeds[i].replace(regExp, "\\/") + "\"],";
  }

  // generate pre_funded_seeds for pre-funded accounts
  let preSeeds = accountConfig.pre_funded_seeds;
  let pre_funded_seeds = "pre_funded_seeds: \\&[";
  for(var i = 0; i <preSeeds.length; i++) {
    if(i != preSeeds.length - 1) {
      pre_funded_seeds = pre_funded_seeds + "\"" + preSeeds[i].replace(regExp, "\\/") + "\",";
    } else 
      pre_funded_seeds = pre_funded_seeds + "\"" + preSeeds[i].replace(regExp, "\\/") + "\"],";
  }

  // generate sudo_account_seeds for sudo account
  let sudo_account_seed = "sudo_account_seed: \"" + accountConfig["sudo_account_seed"].replace(regExp, "\\/") + "\"";

  console.log(admins);
  console.log(enabled_string);
  console.log(authorities_seeds);
  console.log(pre_funded_seeds);
  console.log(sudo_account_seed);
}

getAccountConfig();
