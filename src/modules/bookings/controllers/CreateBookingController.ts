import { NextFunction, Request, Response } from 'express';
import { BookingService } from '../services';
import { ResponseHandler } from '../../../shared/utils/ResponseHandler';
import { HttpStatusCodes } from '../../../shared/utils/HttpStatusCodes';
const { sendSuccessResponse } = ResponseHandler;

export class CreateBookingController {
  private static bookingService: BookingService;
  static() {
    CreateBookingController.bookingService = new BookingService();
  }
  public static bookEvent(req: Request, res: Response, next: NextFunction) {
    const { eventId } = req.body;

    const response = CreateBookingController.bookingService.createBooking({ userId: req.currentUser!.id, eventId });

    sendSuccessResponse(res, HttpStatusCodes.CREATED, 'Booking created successfully.', response);
  }
}
