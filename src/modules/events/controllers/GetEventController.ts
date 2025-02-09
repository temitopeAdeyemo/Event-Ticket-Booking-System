import { NextFunction, Request, Response } from 'express';
import { GetEventService } from '../services';
import { ResponseHandler } from '../../../shared/utils/ResponseHandler';
import { HttpStatusCodes } from '../../../shared/utils/HttpStatusCodes';
const { sendSuccessResponse } = ResponseHandler;
import { injectable as Injectable, inject as Inject } from 'tsyringe';
import { catchAsync } from '../../../shared/utils/catchAsync';

@Injectable()
export class GetEventController {
  constructor(@Inject(GetEventService) private readonly getEventService: GetEventService) {}

  public fetchEvent = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { eventId } = req.params;

    const booking = await this.getEventService.getEvent({ eventId });

    sendSuccessResponse(res, HttpStatusCodes.OK, 'Event fetched successfully', booking);
  });

  public fetchEvents = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const bookings = await this.getEventService.getEvents();

    sendSuccessResponse(res, HttpStatusCodes.OK, 'Events fetched successfully', bookings);
  });
}
