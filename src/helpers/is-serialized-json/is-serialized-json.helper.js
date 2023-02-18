import { jsonService } from "../../services/services.js";

const isSerializedJson = (stringToCheck) => {
  try {
    const parsed = jsonService.parse(stringToCheck);
    return typeof parsed === "object";
  } catch (err) {
    return false;
  }
};

export { isSerializedJson };
