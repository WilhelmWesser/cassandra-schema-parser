import { config as dotenvConfig } from "dotenv";

dotenvConfig();

const {
  SECURE_CONNECT_BUNDLE_PATH,
  CONNECTION_MODE,
  DB_HOST,
  DB_PORT,
  DATACENTER,
  USERNAME,
  PASSWORD,
} = process.env;

const config = {
  DB: {
    BUNDLE_PATH: String(SECURE_CONNECT_BUNDLE_PATH),
    CONNECTION_MODE: String(CONNECTION_MODE),
    USERNAME: String(USERNAME),
    PASSWORD: String(PASSWORD),
    HOST: String(DB_HOST),
    PORT: Number(DB_PORT),
    DATACENTER: String(DATACENTER),
  },
};

export { config };
