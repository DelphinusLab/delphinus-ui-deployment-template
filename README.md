# delphinus-deployment

## Run express server to get configs and event logs

* run `npm run build`
* run `npm run server`
* server will start at http://localhost:8090

### Example url to get configs/event logs
* http://localhost:8090/l2event/5/10
Get 10 substrate events log from the 6th event.
* http://localhost:8090/merkle-tree-config
Get mongod db port
* http://localhost:8090/substrate-node
Get substratenode address and port

