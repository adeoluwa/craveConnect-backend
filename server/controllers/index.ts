import { Response } from "express";

class Controller {
  public sendSuccessResponse(
    res: Response,
    data: any,
    message?: string | null,
    statusCode?: number | null
  ) {
    return res.status(200 || statusCode).json({
      status: "success",
      data,
      message,
    });
  }
}

export default Controller;
