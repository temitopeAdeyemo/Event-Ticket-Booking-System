import { NextFunction, Request, Response } from 'express';
import { GetBookingService } from '../services';
import { ResponseHandler } from '../../../shared/utils/ResponseHandler';
import { HttpStatusCodes } from '../../../shared/utils/HttpStatusCodes';
const { sendSuccessResponse } = ResponseHandler;
import { injectable as Injectable, inject as Inject } from 'tsyringe';
import { catchAsync } from '../../../shared/utils/catchAsync';

@Injectable()
export class GetBookingController {
  constructor(@Inject(GetBookingService) private readonly getBookingService: GetBookingService) {}

  public fetchBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { bookingId } = req.params;

    const booking = await this.getBookingService.fetchBooking({ userId: req.currentUser!.id, bookingId });

    sendSuccessResponse(res, HttpStatusCodes.OK, 'Booking fetched successfully', booking);
  });

  public fetchBookings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const bookings = await this.getBookingService.fetchBookings({ userId: req.currentUser!.id });

    sendSuccessResponse(res, HttpStatusCodes.OK, 'Bookings fetched successfully', bookings);
  });
}
