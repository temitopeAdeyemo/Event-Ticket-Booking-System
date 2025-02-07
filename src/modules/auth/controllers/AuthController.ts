import { NextFunction, Request, Response } from 'express';
import { injectable  as Injectable, inject as Inject} from "tsyringe";
import { AuthService } from '../services';
import { HttpStatusCodes } from '../../../shared/utils/HttpStatusCodes';
import { ResponseHandler } from '../../../shared/utils/ResponseHandler';
import { catchAsync } from '../../../shared/utils/catchAsync';
const { sendSuccessResponse } = ResponseHandler;

@Injectable()
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  public exec = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const response = await this.authService.exec({ email, password });

    sendSuccessResponse(res, HttpStatusCodes.OK, 'Logged in successfully.', response);
  });
}
