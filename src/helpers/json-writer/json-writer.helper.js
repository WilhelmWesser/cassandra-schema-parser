import { writeFile } from "fs/promises";
import { RESULT_JSON_FILE_NAME } from "../../common/constants/json/json.js";
import { logger } from "../../services/services.js";

const writeSerializedSchema = async (jsonString) => {
  try {
    await writeFile(RESULT_JSON_FILE_NAME, jsonString);
    logger.showInLog(
      `Database schema has been successfully saved in ${RESULT_JSON_FILE_NAME} file`
    );
  } catch (err) {
    logger.showInErrors(
      `While saving schema result in file occured error ${err}`
    );
  }
};

export { writeSerializedSchema };
