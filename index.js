import { Client, auth } from "cassandra-driver";
import { config } from "./config.js";

const { DB } = config;

async function run() {
  // const client = new Client({
  //   cloud: {
  //     secureConnectBundle: DB.BUNDLE_PATH,
  //   },
  //   credentials: {
  //     username: DB.CLIENT_ID,
  //     password: DB.CLIENT_SECRET,
  //   },
  // });

  const client = new Client({
    localDataCenter: "datacenter1",
    contactPoints: ["127.0.0.1:9042"],
    authProvider: new auth.PlainTextAuthProvider("cassandra", "cassandra"),
  });

  await client.connect();

  const rs = await client.execute("SELECT * FROM system.local");
  console.log(`Your cluster returned ${rs.rowLength} row(s)`);

  await client.shutdown();
}

run();
