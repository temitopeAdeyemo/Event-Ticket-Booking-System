export class ResponseCaptureMiddleware {
  static responseInterceptor = (req: any, res: any, next: any) => {
    const originalSend = res.send;

    res.send = function (body: any) {
      res.locals.responseBody = body;
      return originalSend.apply(this, arguments);
    };

    next();
  };
}
