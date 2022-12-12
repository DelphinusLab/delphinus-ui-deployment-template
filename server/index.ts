import express from "express";
import cors from "cors";

import serverConf from "../config/server.json";
import substrateNode from "../config/substrate-node.json";
import merkleTreeConfig from "../config/merkle-tree-config.json";
import { ethConfigbyRole } from "../config/eth-config";
import { L1ClientRole } from "../src/types";
import { DBClient } from "./db";

const app = express();
app.use(cors());
const port = serverConf.port;

async function main() {
  const client = new DBClient();

  app.get("/substrate-node", (req, res) => {
    res.send(JSON.stringify(substrateNode));
  });

  app.get("/merkle-tree-config", (req, res) => {
    res.send(JSON.stringify(merkleTreeConfig));
  });

  app.get("/eth-config/wallet", (req, res) => {
    res.send(JSON.stringify(ethConfigbyRole(L1ClientRole.Wallet)));
  });

  app.get("/eth-config/monitor", (req, res) => {
    res.send(JSON.stringify(ethConfigbyRole(L1ClientRole.Monitor)));
  });

  app.listen(serverConf.port, () => {
    console.log(`server started at http://localhost:${port}`);
  });

  app.get(
    "/substrate/:collection_name",
    async (req: any, res: any, next: any) => {
      try {
        client
          .getAll("substrate", req.params.collection_name)
          .then((result: any) => {
            res.send(result);
          });
      } catch (e: any) {
        next(e);
      }
    }
  );

  app.get("/l2event/:start/:length", async (req: any, res: any, next: any) => {
    try {
      client
        .getRange(
          "substrate",
          "l2_event",
          parseInt(req.params.start),
          parseInt(req.params.length)
        )
        .then((result: any) => {
          res.status(200).send({ success: true, result: result });
        });
    } catch (e: any) {
      next(e); // Pass to error handler
    }
  });
  app.get("/l2transactions", async (req: any, res: any, next: any) => {
    try {
      client.getAll("substrate", "l2_transactions").then((result: any) => {
        res.send(result);
      });
    } catch (e: any) {
      next(e); // Pass to error handler
    }
  });
  app.get(
    "/l2transactions/:l2Address/:l2AccountIndex",
    async (req: any, res: any, next: any) => {
      try {
        const { l2Address, l2AccountIndex } = req.params;
        console.log("l2Address", l2Address);
        console.log("l2AccountIndex", l2AccountIndex);
        let txs = await client.invokeDB(async (client: any) => {
          const db = client.db("substrate");
          return await db
            .collection("l2_transactions")
            .find({
              $or: [{ signer: l2Address }, { accountIndex: l2AccountIndex }],
            })
            .sort({ timestamp: -1 })
            .toArray();
        });
        res.send(txs);
      } catch (e: any) {
        next(e); // Pass to error handler
      }
    }
  );

  //Generalised error handler
  app.use(errorHandler);

  /* Layer1 event track
  app.get('/eth/:eid/:ename/', async (req:any, res:any) => {
    const BridgeJSON = require("solidity/build/contracts/Bridge.json");
    const network_id = req.params.eid;
    const address = BridgeJSON.networks[network_id].address;
    const db_name = network_id + address;
    client.getAll(db_name, req.params.ename).then((result:any) => {
      res.send(result);
    })
  });
  */
}

//error handler function, pass it to app.use, log any issues and send a 500 response
function errorHandler(err: any, req: any, res: any, next: any) {
  console.error(err);
  res.status(500).send("Internal server error");
}
main();
