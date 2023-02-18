import { Seeds } from "./seeds.js";
import { Connector } from "../connection/connector.js";
import { logger } from "../../services/services.js";

const executeSeeding = async () => {
  const connector = new Connector();

  try {
    await connector.connect();
    const client = connector.getClient;

    const seed = new Seeds(client);
    await seed.seed();
    logger.showInLog("Data has been seeded successfully");
  } catch (err) {
    logger.showInErrors(`While seeding following error occured: ${err}`);
  } finally {
    await connector.disconnect();
  }
};

executeSeeding();
