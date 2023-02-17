import {
  SYSTEM_SCHEMA,
  SCHEMA_STORAGED_PROPERTIES,
  USER_DEFINED_TYPES_KEYS,
} from "../../common/constants/constants";

class CassandraRepository {
  #client;

  constructor(client) {
    this.#client = client;
  }

  async extractSchema(keyspaceName) {
    const tables = await this.#extractTables(keyspaceName);
    const userDefinedTypes = await this.#extractUserDefinedTypes(keyspaceName);

    const tablesToReturn = [];
    tables.forEach(async (tableName) => {
      const tableColumns = await this.#extractColumns(keyspaceName, tableName);
      const firstRow = await this.#readFirstRow(keyspaceName, tableName);

      tablesToReturn.push({
        name: tableName,
        columns: tableColumns,
        firstRow,
      });
    });

    const userDefinedTypesToReturn = [];
    userDefinedTypes.forEach(async (userDefinedType) => {
      userDefinedTypesToReturn.push({
        name: userDefinedType[USER_DEFINED_TYPES_KEYS.TYPE_NAME],
        fields: userDefinedType[USER_DEFINED_TYPES_KEYS.FIELD_NAMES].map(
          (fieldName, index) => ({
            name: fieldName,
            type: userDefinedType[USER_DEFINED_TYPES_KEYS.FIELD_TYPES][index],
          })
        ),
      });
    });

    return {
      keyspace: keyspaceName,
      tables: tablesToReturn,
      userDefinedTypes: userDefinedTypesToReturn,
    };
  }

  async #extractTables(keyspaceName) {
    const res = await this.#executeQuery(
      `SELECT table_name FROM ${SYSTEM_SCHEMA}.${SCHEMA_STORAGED_PROPERTIES.TABLES} WHERE keyspace_name = '${keyspaceName}';`
    );

    const columnName = "table_name";
    return res.rows.map((row) => row[columnName]);
  }

  async #extractColumns(keyspaceName, tableName) {
    const res = await this.#executeQuery(
      `SELECT column_name, type FROM ${SYSTEM_SCHEMA}.${SCHEMA_STORAGED_PROPERTIES.COLUMNS} WHERE keyspace_name = '${keyspaceName}' AND table_name = '${tableName}'`
    );

    const columnsToExrtact = ["column_name", "type", "kind"];
    return res.rows.map((row) => {
      const extractedRow = {};
      columnsToExrtact.forEach((column) => {
        extractedRow[column] = row[column];
      });
      return extractedRow;
    });
  }

  async #readFirstRow(keyspaceName, tableName) {
    const res = await this.#executeQuery(
      `SELECT * FROM ${keyspaceName}.${tableName};`
    );

    return res.first();
  }

  async #extractUserDefinedTypes(keyspaceName) {
    const res = await this.#executeQuery(
      `SELECT * FROM ${SYSTEM_SCHEMA}.${SCHEMA_STORAGED_PROPERTIES.TYPES} WHERE keyspace_name = '${keyspaceName}'`
    );

    return res.rows;
  }

  #executeQuery(query) {
    return this.#client.execute(query);
  }
}

export { CassandraRepository };
