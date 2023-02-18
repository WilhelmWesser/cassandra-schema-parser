import { JsonService } from "./json/json.service.js";
import { LoggerService } from "./logger/logger.service.js";

const jsonService = new JsonService();
const logger = new LoggerService();

export { logger, jsonService };
