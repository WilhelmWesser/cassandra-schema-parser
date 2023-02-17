import { logger } from "./services/services.js";
import { Connector } from "./db/connection/connector.js";
import { CassandraRepository } from "./db/repositories/repositories.js";
import { KEYSPACE_NAME } from "./common/constants/constants.js";

const bootstrap = async () => {
  const connector = new Connector();
  await connector.connect();

  const client = connector.getClient;
  const cassandraRepo = new CassandraRepository(client);

  const schema = await cassandraRepo.extractSchema(KEYSPACE_NAME);

  logger.showInLog(schema.tables);

  await connector.disconnect();
};

bootstrap();
