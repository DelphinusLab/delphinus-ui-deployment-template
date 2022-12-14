import * as fs from "fs";
import fetch from "node-fetch";
import { address } from "./server.json";

async function downloadConfig() {
  console.log("Downloading contracts-info.json ...");
  let response = await fetch(address + "/contracts-info");
  let config = await response.json();
  fs.writeFileSync(__dirname + "/contracts-info.json", JSON.stringify(config));
  console.log("Downloaded contracts-info.json");
}

downloadConfig().catch((err) => {
  console.log(err);
});
