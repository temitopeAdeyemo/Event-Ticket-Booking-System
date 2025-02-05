class AppError {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;
  public data: boolean;
  public message: string;

  constructor(message: string, statusCode?: number, data?: any) {

    this.statusCode = statusCode || 500;
    this.status = `${statusCode}`.startsWith("4") ? "failed" : "error";
    this.isOperational = true;
    this.data = data;
    this.message = message;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
