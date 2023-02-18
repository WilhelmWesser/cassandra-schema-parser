import { Connector } from "./db/connection/connector.js";
import { CassandraRepository } from "./db/repositories/repositories.js";
import { KEYSPACE_NAME } from "./common/constants/constants.js";
import { CassandraSchemaConverterToJsonService } from "./services/converters/cassandra-schema-converter-to-json/cassandra-schema-converter-to-json.service.js";
import { writeSerializedSchema } from "./helpers/json-writer/json-writer.helper.js";

const bootstrap = async () => {
  const connector = new Connector();
  await connector.connect();

  const client = connector.getClient;
  const cassandraRepo = new CassandraRepository(client);

  const schema = await cassandraRepo.extractSchema(KEYSPACE_NAME);

  const dbToJsonSchemaTransformer = new CassandraSchemaConverterToJsonService(
    schema
  );
  const json = dbToJsonSchemaTransformer.convert();

  await writeSerializedSchema(json);

  await connector.disconnect();
};

bootstrap();
