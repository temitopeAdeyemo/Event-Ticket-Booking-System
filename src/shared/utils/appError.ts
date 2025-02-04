class AppError extends Error {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;
  public data: boolean;

  constructor(message: string, statusCode?: number, data?: any) {
    super(message);

    this.statusCode = statusCode || 500;
    this.status = `${statusCode}`.startsWith("4") ? "failed" : "error";
    this.isOperational = true;
    this.data = data;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
