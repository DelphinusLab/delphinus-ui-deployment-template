const DBConfig = require("../config/l2-event-record.json");
const MongoClient = require("mongodb").MongoClient;

function getURL() {
  return DBConfig.db;
}

export class DBClient {
  url: string;

  constructor() {
    this.url = getURL();
  }

  async invokeDB(cb: (client: any) => Promise<any>) {
    const client = await MongoClient.connect(this.url);
    return cb(client).finally(() => client.close());
  }

  public async getAll(database: string, collection: string) {
    console.log("getAll", database, collection);
    return this.invokeDB(async (client: any) => {
      const db = client.db(database);
      return db.collection(collection).find().toArray();
    });
  }

  public async getRange(
    database: string,
    collection: string,
    start: number,
    length: number
  ): Promise<Array<any>> {
    console.log("getRange", database, collection, start, length);
    return this.invokeDB(async (client: any) => {
      const db = client.db(database);
      let c = db.collection(collection);
      let cursor = c.find({});
      let r = await cursor.skip(start).limit(length).toArray();
      return r;
    });
  }
  //filter collection by a field and value
  public async getFiltered(
    database: string,
    collection: string,
    field: string,
    value: string
  ): Promise<Array<any>> {
    console.log("getFiltered", database, collection, field, value);
    return this.invokeDB(async (client: any) => {
      const db = client.db(database);
      let c = db.collection(collection);
      let filter: any = {};
      filter[field] = value;
      let cursor = c.find(filter);
      let r = await cursor.toArray();
      return r;
    });
  }
}
