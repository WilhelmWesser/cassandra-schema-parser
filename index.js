import { Client, auth } from "cassandra-driver";
import { config } from "./config.js";

const { DATACENTER, HOST, PORT, USERNAME, PASSWORD } = config.DB;

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
    localDataCenter: DATACENTER,
    contactPoints: [`${HOST}:${PORT}`],
    authProvider: new auth.PlainTextAuthProvider(USERNAME, PASSWORD),
  });

  await client.connect();

  const rs = await client.execute("SELECT * FROM system.local");
  console.log(`Your cluster returned ${rs.rowLength} row(s)`);

  await client.shutdown();
}

run();
