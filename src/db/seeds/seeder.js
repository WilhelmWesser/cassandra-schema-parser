import { Seeds } from "./seeds.js";
import { Connector } from "../connection/connector.js";

const executeSeeding = async () => {
  const connector = new Connector();

  try {
    logger.showInLog("Data has been inserted successfully");
    await connector.connect();
    const client = connector.getClient;

    const seed = new Seeds(client);
    await seed.seed();
  } catch (err) {
    logger.showInErrors(`While seeding following error occured: ${err}`);
  } finally {
    await connector.disconnect();
  }
};

executeSeeding();
