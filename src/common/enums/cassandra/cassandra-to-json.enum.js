import { CassandraTypes } from "./cassandra-types.enum.js";
import { JsonSchemaTypes } from "../json/json-schema-types.enum.js";

const CassandraToJSONTypes = {
  [CassandraTypes.ASCII]: JsonSchemaTypes.STRING,
  [CassandraTypes.BLOB]: JsonSchemaTypes.STRING,
  [CassandraTypes.BOOLEAN]: JsonSchemaTypes.BOOLEAN,
  [CassandraTypes.COUNTER]: JsonSchemaTypes.INTEGER,
  [CassandraTypes.DATE]: JsonSchemaTypes.STRING,
  [CassandraTypes.DECIMAL]: JsonSchemaTypes.NUMBER,
  [CassandraTypes.DOUBLE]: JsonSchemaTypes.NUMBER,
  [CassandraTypes.DURATION]: JsonSchemaTypes.STRING,
  [CassandraTypes.FLOAT]: JsonSchemaTypes.NUMBER,
  [CassandraTypes.FROZEN]: JsonSchemaTypes.OBJECT,
  [CassandraTypes.INET]: JsonSchemaTypes.STRING,
  [CassandraTypes.INT]: JsonSchemaTypes.INTEGER,
  [CassandraTypes.LIST]: JsonSchemaTypes.ARRAY,
  [CassandraTypes.MAP]: JsonSchemaTypes.OBJECT,
  [CassandraTypes.SET]: JsonSchemaTypes.ARRAY,
  [CassandraTypes.TUPLE]: JsonSchemaTypes.ARRAY,
  [CassandraTypes.SMALLINT]: JsonSchemaTypes.INTEGER,
  [CassandraTypes.TIMESTAMP]: JsonSchemaTypes.STRING,
  [CassandraTypes.TIME]: JsonSchemaTypes.STRING,
  [CassandraTypes.TIMEUUID]: JsonSchemaTypes.STRING,
  [CassandraTypes.TINYINT]: JsonSchemaTypes.INTEGER,
  [CassandraTypes.TEXT]: JsonSchemaTypes.STRING,
  [CassandraTypes.UUID]: JsonSchemaTypes.STRING,
  [CassandraTypes.VARCHAR]: JsonSchemaTypes.STRING,
  [CassandraTypes.VARINT]: JsonSchemaTypes.INTEGER,
};

export { CassandraToJSONTypes };
