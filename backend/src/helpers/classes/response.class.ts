import { Response } from "express";

class CResponse {
  constructor() {}

  private static default() {
    const response: IResponse = {
      code: 200,
      status: 'ok',
      message: 'Action completed successfully',
    };
    return response;
  }

  public static error(res: Response, resp?: IResponse, ) {
    let response = this.default();
    response = { ...response, code: 404, status: 'error' };
    if (resp) response = { ...response, ...resp };

    return this.response(response, res);
}

private static response(resp: IResponse, res: Response) {
      
      return res.status(Number(resp.code)).json(resp);
  }

  public static success(res: Response, resp?: IResponse) {
    let response = this.default();
    if (resp) response = { ...response, ...resp };
    return this.response(response, res);
  }
}

interface IResponse {
  code?: number;
  status?: string;
  message?: string;
  data?: any;
}


export {CResponse}