import {
  KEYSPACE_NAME,
  ADDRESS_TYPE_NAME,
  ADDRESS_TYPE_FIELDS,
  USERS_TABLE_NAME,
  USERS_TABLE_FIELDS,
  CASSANDRA_TYPES,
  OTHER_POSSIBLE_TYPES_TEST_TABLE_NAME,
  OTHER_POSSIBLE_TYPES_TEST_TABLE_FIELDS,
} from "../../common/constants/constants.js";

class Seeds {
  #client;

  constructor(client) {
    this.#client = client;
  }

  async seed() {
    await this.#seedKeyspace();
    await this.#createAddressType();
    await this.#createUserTable();
    await this.#createOtherPossibleTypesTestTable();
    await this.#insertData();
  }

  async #seedKeyspace() {
    await this.#client
      .execute(`CREATE KEYSPACE IF NOT EXISTS ${KEYSPACE_NAME} WITH REPLICATION = {
        'class': 'SimpleStrategy', 'replication_factor': 2
    };`);
  }

  async #createAddressType() {
    await this.#client
      .execute(`CREATE TYPE IF NOT EXISTS ${KEYSPACE_NAME}.${ADDRESS_TYPE_NAME} (
        ${ADDRESS_TYPE_FIELDS.CITY} ${CASSANDRA_TYPES.VARCHAR},
        ${ADDRESS_TYPE_FIELDS.STREET} ${CASSANDRA_TYPES.VARCHAR},
        ${ADDRESS_TYPE_FIELDS.HOUSE} ${CASSANDRA_TYPES.INT},
    );`);
  }

  async #createUserTable() {
    await this.#client
      .execute(`CREATE TABLE IF NOT EXISTS ${KEYSPACE_NAME}.${USERS_TABLE_NAME} (
        ${USERS_TABLE_FIELDS.ID} ${CASSANDRA_TYPES.UUID} PRIMARY KEY,
        ${USERS_TABLE_FIELDS.NAME} ${CASSANDRA_TYPES.VARCHAR},
        ${USERS_TABLE_FIELDS.SURNAME} ${CASSANDRA_TYPES.VARCHAR},
        ${USERS_TABLE_FIELDS.AGE} ${CASSANDRA_TYPES.INT},
        ${USERS_TABLE_FIELDS.ADDRESS} ${CASSANDRA_TYPES.TEXT}
    );`);
  }

  async #createOtherPossibleTypesTestTable() {
    await this.#client
      .execute(`CREATE TABLE IF NOT EXISTS ${KEYSPACE_NAME}.${OTHER_POSSIBLE_TYPES_TEST_TABLE_NAME} (
        ${OTHER_POSSIBLE_TYPES_TEST_TABLE_FIELDS.ID} ${CASSANDRA_TYPES.INT} PRIMARY KEY,
        ${OTHER_POSSIBLE_TYPES_TEST_TABLE_FIELDS.DATE_COLUMN} ${CASSANDRA_TYPES.DATE},
        ${OTHER_POSSIBLE_TYPES_TEST_TABLE_FIELDS.DURATION_COLUMN} ${CASSANDRA_TYPES.DURATION},
        ${OTHER_POSSIBLE_TYPES_TEST_TABLE_FIELDS.BOOLEAN_COLUMN} ${CASSANDRA_TYPES.BOOLEAN},
        ${OTHER_POSSIBLE_TYPES_TEST_TABLE_FIELDS.MAP_COLUMN} ${CASSANDRA_TYPES.MAP}<${CASSANDRA_TYPES.INT}, ${CASSANDRA_TYPES.VARCHAR}>,
        ${OTHER_POSSIBLE_TYPES_TEST_TABLE_FIELDS.SET_COLUMN} ${CASSANDRA_TYPES.SET}<${CASSANDRA_TYPES.VARCHAR}>,
        ${OTHER_POSSIBLE_TYPES_TEST_TABLE_FIELDS.LIST_COLUMN} ${CASSANDRA_TYPES.LIST}<${CASSANDRA_TYPES.INT}>,
        ${OTHER_POSSIBLE_TYPES_TEST_TABLE_FIELDS.TUPLE_COLUMN} ${CASSANDRA_TYPES.TUPLE}<${CASSANDRA_TYPES.INT}, ${CASSANDRA_TYPES.VARCHAR}>,
        ${OTHER_POSSIBLE_TYPES_TEST_TABLE_FIELDS.FROZEN_LIST_COLUMN} frozen<${CASSANDRA_TYPES.LIST}<${CASSANDRA_TYPES.INT}>>,
    );`);
  }

  async #insertData() {
    const testUserData = {
      id: "50554d6e-29bb-11e5-b345-feff819cdc9f",
      name: "Whilliam",
      surname: "Willson",
      age: 28,
      address: '{"city":"Lviv", "street":"Chornovola", "house":59}',
    };

    const userInsertionQuery = `INSERT INTO ${KEYSPACE_NAME}.${USERS_TABLE_NAME} (${USERS_TABLE_FIELDS.ID}, ${USERS_TABLE_FIELDS.NAME}, ${USERS_TABLE_FIELDS.SURNAME}, ${USERS_TABLE_FIELDS.AGE}, ${USERS_TABLE_FIELDS.ADDRESS}) 
    VALUES (${testUserData.id}, '${testUserData.name}', '${testUserData.surname}', ${testUserData.age}, '${testUserData.address}');
    `;
    await this.#client.execute(userInsertionQuery);

    const otherPossibleTypesData = {
      id: 1,
      date: "2022-02-17",
      duration: "12h30m",
      boolean: true,
      map: "{1: 'a', 2: 'b', 3: 'c'}",
      set: "{'a', 'b'}",
      list: "[1, 2, 3]",
      tuple: "(1, 'a')",
      frozen_list: "[4, 5, 6, 7, 8, 9, 10]",
    };
    const otherPossibleTypesTableInsertion = `INSERT INTO ${KEYSPACE_NAME}.${OTHER_POSSIBLE_TYPES_TEST_TABLE_NAME} (
        ${OTHER_POSSIBLE_TYPES_TEST_TABLE_FIELDS.ID}, ${OTHER_POSSIBLE_TYPES_TEST_TABLE_FIELDS.DATE_COLUMN}, ${OTHER_POSSIBLE_TYPES_TEST_TABLE_FIELDS.DURATION_COLUMN}, ${OTHER_POSSIBLE_TYPES_TEST_TABLE_FIELDS.BOOLEAN_COLUMN}, ${OTHER_POSSIBLE_TYPES_TEST_TABLE_FIELDS.MAP_COLUMN}, ${OTHER_POSSIBLE_TYPES_TEST_TABLE_FIELDS.SET_COLUMN}, ${OTHER_POSSIBLE_TYPES_TEST_TABLE_FIELDS.LIST_COLUMN}, ${OTHER_POSSIBLE_TYPES_TEST_TABLE_FIELDS.TUPLE_COLUMN}, ${OTHER_POSSIBLE_TYPES_TEST_TABLE_FIELDS.FROZEN_LIST_COLUMN}
    ) VALUES (${otherPossibleTypesData.id}, '${otherPossibleTypesData.date}', ${otherPossibleTypesData.duration}, ${otherPossibleTypesData.boolean}, ${otherPossibleTypesData.map}, ${otherPossibleTypesData.set}, ${otherPossibleTypesData.list}, ${otherPossibleTypesData.tuple}, ${otherPossibleTypesData.frozen_list})`;

    await this.#client.execute(otherPossibleTypesTableInsertion);
  }
}

export { Seeds };
