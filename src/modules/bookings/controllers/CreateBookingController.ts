import { NextFunction, Request, Response } from 'express';
import { BookingService } from '../services';
import { ResponseHandler } from '../../../shared/utils/ResponseHandler';
import { HttpStatusCodes } from '../../../shared/utils/HttpStatusCodes';
const { sendSuccessResponse } = ResponseHandler;
import { injectable as Injectable, inject as Inject } from 'tsyringe';
import { catchAsync } from '../../../shared/utils/catchAsync';

@Injectable()
export class CreateBookingController {
  constructor(@Inject(BookingService) private readonly bookingService: BookingService) {}

  public bookEvent = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { eventId } = req.body;
    const response = await this.bookingService.createBooking({ userId: req.currentUser!.id, eventId });
    const message = response.bookingId ? 'Booking created successfully.' : 'You have been added to the waitlist.';
    sendSuccessResponse(res, HttpStatusCodes.CREATED, message, response);
  });
}
