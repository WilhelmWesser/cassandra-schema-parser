import { JSON_SCHEMA_VERSION } from "../../../common/constants/constants.js";
import { SchemaConverter } from "../schema-converter.js";

class CassandraSchemaConverterService extends SchemaConverter {
  JSONSchemaVersion;

  constructor(cassandraSchema) {
    super(cassandraSchema);
    this.JSONSchemaVersion = JSON_SCHEMA_VERSION;
  }

  toJson() {
    console.log(this.schema);
  }
}

export { CassandraSchemaConverterService };
