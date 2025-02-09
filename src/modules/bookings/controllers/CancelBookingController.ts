import { NextFunction, Request, Response } from 'express';
import { CancelBookingService } from '../services';
import { ResponseHandler } from '../../../shared/utils/ResponseHandler';
import { HttpStatusCodes } from '../../../shared/utils/HttpStatusCodes';
const { sendSuccessResponse } = ResponseHandler;
import { injectable as Injectable, inject as Inject } from 'tsyringe';
import { catchAsync } from '../../../shared/utils/catchAsync';

@Injectable()
export class CancelBookingController {
  constructor(@Inject(CancelBookingService) private readonly cancelBookingService: CancelBookingService) {}

  public cancelBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { bookingId } = req.body;

    await this.cancelBookingService.cancelBooking({ userId: req.currentUser!.id, bookingId });

    sendSuccessResponse(res, HttpStatusCodes.OK, 'Booking Cancelled successfully', null);
  });
}
