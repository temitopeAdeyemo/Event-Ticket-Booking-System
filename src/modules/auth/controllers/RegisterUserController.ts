import { NextFunction, Request, Response } from 'express';
import { RegisterUserService } from '../services';
import { injectable  as Injectable, inject as Inject} from "tsyringe";
import { HttpStatusCodes } from '../../../shared/utils/HttpStatusCodes';
import { ResponseHandler } from '../../../shared/utils/ResponseHandler';
import { catchAsync } from '../../../shared/utils/catchAsync';
const { sendSuccessResponse } = ResponseHandler;

@Injectable()
export class RegisterUserController {
  constructor(@Inject(RegisterUserService) private readonly registerUserService: RegisterUserService) {}

  public exec = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, fullName } = req.body;

    const { id } = await this.registerUserService.exec({ email, password, fullName });

    sendSuccessResponse(res, HttpStatusCodes.CREATED, 'User created successfully.', { id });
  });
}
