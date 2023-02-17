import { logger } from "./services/services.js";
import { Connector } from "./db/connection/connector.js";
import { CassandraRepository } from "./db/repositories/repositories.js";

async function run() {
  const connector = new Connector();
  await connector.connect();

  const client = connector.getClient;
  const cassandraRepo = new CassandraRepository(client);

  const schema = await cassandraRepo.extractSchema("csp");

  logger.showInLog(schema);

  const rs = await client.execute("SELECT * FROM system.local");
  logger.showInLog(`Your cluster returned ${rs.rowLength} row(s)`);

  await connector.disconnect();
}

run();
