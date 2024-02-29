import Exception from "../utils/ExceptionHandler";
import HttpStatusCode from "./HttpsResponse";

class validator {
  static RequestValidatorError(payload: any) {
    return new Exception(
      "Reequest Validation Error",
      HttpStatusCode.HTTP_BAD_REQUEST,
      payload
    );
  }
}

export default validator;
