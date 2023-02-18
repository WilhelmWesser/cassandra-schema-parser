import { ValidationRules } from "../../common/enums/enums.js";
import { AbstractValidator } from "../abstract/abstract.validator.js";
import { logger } from "../../services/services.js";

class EnvValidator extends AbstractValidator {
  #envs;
  #validationParams;

  constructor(envs, validationParams) {
    super();
    this.#envs = envs;
    this.#validationParams = validationParams;
  }

  validate() {
    let isValid = this.#validateAll();
    const paramsToValidateNames = Object.keys(this.#validationParams);
    paramsToValidateNames.forEach((paramName) => {
      const validationRules = this.#validationParams[paramName];
      const validatioRulesNames = Object.keys(validationRules);
      validatioRulesNames.forEach((validationRuleName) => {
        try {
          this[validationRuleName](
            paramName,
            this.#envs[paramName],
            validationRules[validationRuleName]
          );
        } catch (error) {
          isValid = false;
          logger.showInErrors(error);
        }
      });
    });
    return isValid;
  }

  #validateAll() {
    let validationResult = true;
    const validationRulesAppliedToAllProperties = this.#validationParams.all;
    if (
      validationRulesAppliedToAllProperties &&
      Object.entries(validationRulesAppliedToAllProperties)
    ) {
      const validationRulesNames = Object.keys(
        validationRulesAppliedToAllProperties
      );
      const envsNames = Object.keys(this.#envs);
      const envsValuesToCheck = Object.values(this.#envs);
      validationRulesNames.forEach((name) => {
        envsValuesToCheck.forEach((envValue, index) => {
          try {
            this[name](
              envsNames[index],
              envValue,
              validationRulesAppliedToAllProperties[name]
            );
          } catch (error) {
            logger.showInErrors(error);
            validationResult = false;
          }
        });
      });
    }
    delete this.#validationParams.all;
    return validationResult;
  }

  [ValidationRules.IS_NOT_EMPTY](key, value) {
    if (!value || !value.length) {
      throw new Error(`${key} must not be empty`);
    }
  }

  [ValidationRules.IS_EQUAL_TO](key, value, valuesToBeEqualWith) {
    if (!valuesToBeEqualWith) {
      throw new Error("Options list to compare value with was not provided");
    }
    const isValueEqualToOneOfOptions = valuesToBeEqualWith.some(
      (toCompareWith) => value === toCompareWith
    );
    if (!isValueEqualToOneOfOptions) {
      throw new Error(`${key} is not equal to any of the provided values`);
    }
  }
}

export { EnvValidator };
