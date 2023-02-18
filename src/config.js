import { config as dotenvConfig } from "dotenv";
import { ConnectionModes, ValidationRules } from "./common/enums/enums.js";
import { logger } from "./services/services.js";
import { EnvValidator } from "./validators/validators.js";

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

const toValidate = {
  SECURE_CONNECT_BUNDLE_PATH,
  CONNECTION_MODE,
  DB_HOST,
  DB_PORT,
  DATACENTER,
  USERNAME,
  PASSWORD,
};
const validationRules = {
  all: { [ValidationRules.IS_NOT_EMPTY]: true },
  CONNECTION_MODE: {
    [ValidationRules.IS_EQUAL_TO]: [
      ConnectionModes.REMOTE_CLUSTER,
      ConnectionModes.LOCAL,
    ],
  },
};
const validator = new EnvValidator(toValidate, validationRules);
const isValid = validator.validate();

if (!isValid) {
  throw new Error(logger.showInErrors("Invalid config"));
}

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
