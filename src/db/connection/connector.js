import { Client } from "cassandra-driver";
import { ConnectionModes } from "../../common/enums/enums.js";
import { config } from "../../config.js";
import { logger } from "../../services/services.js";

const { DB } = config;

class Connector {
  #client;

  get getClient() {
    return this.#client;
  }

  async connect() {
    const isConnectionRemote =
      DB.CONNECTION_MODE === ConnectionModes.REMOTE_CLUSTER;

    const client = isConnectionRemote
      ? this.#remoteConnection()
      : this.#localConnection();

    try {
      await client.connect();
      this.#client = client;
      logger.showInLog("Connected to DB");
    } catch (e) {
      logger.showInErrors(`Error ${e} raised while connecting to DB`);
    }
  }

  async disconnect() {
    await this.#client.shutdown();
  }

  #localConnection() {
    const { HOST, PORT, DATACENTER, USERNAME, PASSWORD } = DB;
    const client = new Client({
      contactPoints: [`${HOST}:${PORT}`],
      localDataCenter: DATACENTER,
      credentials: {
        username: USERNAME,
        password: PASSWORD,
      },
    });

    return client;
  }

  #remoteConnection() {
    const { BUNDLE_PATH, USERNAME, PASSWORD } = DB;

    const client = new Client({
      cloud: {
        secureConnectBundle: BUNDLE_PATH,
      },
      credentials: {
        username: USERNAME,
        password: PASSWORD,
      },
    });

    return client;
  }
}

export { Connector };
