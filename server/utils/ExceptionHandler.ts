export default class Exception extends Error {
  statusCode: number;
  status: string;
  error?:any;
  isOperational: boolean;

  constructor(message:string, statusCode?:number | null, error?:any){
    super(message);
    this.statusCode = statusCode || 400;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.error = error;

    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}