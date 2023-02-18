import { JSON_SCHEMA_VERSION } from "../../../common/constants/constants.js";
import { AbstractSchemaConverter } from "../abstract-converter/abstract-schema-converter.js";
import {
  CassandraToJSONTypes,
  CassandraTypes,
  JsonSchemaKeys,
  JsonSchemaTypes,
  JsToCassandraTypes,
} from "../../../common/enums/enums.js";
import { jsonService } from "../../services.js";
import { isSerializedJson } from "../../../helpers/helpers.js";

class CassandraSchemaConverterToJsonService extends AbstractSchemaConverter {
  #JSONSchemaVersion;

  #PRIMITIVE_REG_EXP = /(\w)+/;
  #COLLECTION_REG_EXP =
    /\w+<[(\w+)|\w+<(\w+)(, \w+)*>][(, \w+)|(, \w+<(\w+)(, \w+)*>)]*>/;
  #INNERLY_MULTIPLE_TYPED_COLLECTION_TYPES = /(\w+)(, \w+)+/;

  constructor(cassandraSchema) {
    super(cassandraSchema);
    this.#JSONSchemaVersion = JSON_SCHEMA_VERSION;
  }

  convert() {
    const { tables } = this.schema;
    const resultSchema = [];

    tables.forEach((table) => {
      const { name, columns, firstRow } = table;
      const initialTableSchemaProperties = {};

      const tableSchema = {
        [JsonSchemaKeys.$SCHEMA]: this.#JSONSchemaVersion,
        [JsonSchemaKeys.TYPE]: JsonSchemaTypes.OBJECT,
        [JsonSchemaKeys.TITLE]: name,
        [JsonSchemaKeys.PROPERTIES]: initialTableSchemaProperties,
      };

      this.#parseType(tableSchema, columns, firstRow);

      resultSchema.push(tableSchema);
    });

    return jsonService.stringify(resultSchema);
  }

  #parseType(schemaToFill, columns, firstRow) {
    columns.forEach(({ column_name, type }) => {
      if (isSerializedJson(firstRow[column_name])) {
        const parsedObject = jsonService.parse(firstRow[column_name]);
        const newSchema = {
          type: JsonSchemaTypes.OBJECT,
          [JsonSchemaKeys.PROPERTIES]: {},
        };
        const newFirstRowValues = Object.values(parsedObject);
        const newColumnsValues = Object.keys(parsedObject).map(
          (columnName, index) => ({
            column_name: columnName,
            type: JsToCassandraTypes[typeof Object.values(parsedObject)[index]],
          })
        );
        newFirstRowValues.forEach((firstRowValue, index) => {
          this.#parseType(newSchema, [newColumnsValues[index]], firstRowValue);
        });
        schemaToFill[JsonSchemaKeys.PROPERTIES][column_name] = newSchema;
      } else {
        schemaToFill[JsonSchemaKeys.PROPERTIES][column_name] =
          this.#getColumnType(type);
      }
    });
  }

  #getColumnType(columnType) {
    const withStrippedFrozen = this.#stripFrozen(columnType);
    if (this.#COLLECTION_REG_EXP.test(columnType)) {
      const collectionType = withStrippedFrozen.slice(
        0,
        withStrippedFrozen.indexOf("<")
      );
      const collectionNestedTypes = withStrippedFrozen.slice(
        withStrippedFrozen.indexOf("<") + 1,
        withStrippedFrozen.lastIndexOf(">")
      );
      if (
        this.#INNERLY_MULTIPLE_TYPED_COLLECTION_TYPES.test(
          collectionNestedTypes
        )
      ) {
        const keyTypeIndex = 0;
        const valueTypeIndex = 1;
        return {
          [JsonSchemaKeys.TYPE]: CassandraToJSONTypes[collectionType],
          [collectionType === CassandraTypes.MAP
            ? JsonSchemaKeys.PROPERTIES
            : JsonSchemaKeys.ITEMS]:
            collectionType === CassandraTypes.MAP
              ? {
                  [collectionNestedTypes
                    .split(", ")
                    .map((type) => this.#getColumnType(type).type)[
                    keyTypeIndex
                  ]]: collectionNestedTypes
                    .split(", ")
                    .map((type) => this.#getColumnType(type).type)[
                    valueTypeIndex
                  ],
                }
              : collectionNestedTypes
                  .split(", ")
                  .map((type) => this.#getColumnType(type)),
        };
      } else {
        return {
          [JsonSchemaKeys.TYPE]: CassandraToJSONTypes[collectionType],
          [JsonSchemaKeys.ITEMS]: [this.#getColumnType(collectionNestedTypes)],
        };
      }
    } else if (this.#PRIMITIVE_REG_EXP.test(columnType)) {
      return {
        [JsonSchemaKeys.TYPE]: CassandraToJSONTypes[withStrippedFrozen],
      };
    }
  }

  #stripFrozen(columnType) {
    const frozenSubstring = "frozen<";
    const frozenCloseCaret = ">";
    return columnType.includes(frozenSubstring)
      ? this.#stripFrozen(
          columnType.replace(frozenSubstring, "").replace(frozenCloseCaret, "")
        )
      : columnType;
  }
}

export { CassandraSchemaConverterToJsonService };
