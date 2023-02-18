import { CassandraTypes } from "../cassandra/cassandra-types.enum.js";

const JsToCassandraTypes = Object.freeze({
  string: CassandraTypes.VARCHAR,
  number: CassandraTypes.INT,
  boolean: CassandraTypes.BOOLEAN,
});

export { JsToCassandraTypes };
