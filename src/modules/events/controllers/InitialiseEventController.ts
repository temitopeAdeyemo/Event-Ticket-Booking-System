import { NextFunction, Request, Response } from 'express';
import { EventService } from '../services';
import { IEventDTO } from '../dto';
import { ResponseHandler } from '../../../shared/utils/ResponseHandler';
import { HttpStatusCodes } from '../../../shared/utils/HttpStatusCodes';
import { injectable as Injectable, inject as Inject } from 'tsyringe';
import { catchAsync } from '../../../shared/utils/catchAsync';

const { sendSuccessResponse } = ResponseHandler;

@Injectable()
export class InitialiseEventController {
  constructor(@Inject(EventService) private readonly eventService: EventService) {}

  eventStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { eventId } = req.params;
    const { availableTickets, waitingListCount } = await this.eventService.eventStatus(eventId);

    sendSuccessResponse(res, HttpStatusCodes.OK, 'Event status fetched successfully.', { availableTickets, waitingListCount });
  });

  public initialize = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { description, totalTicketSlot, eventName, eventDate } = req.body as IEventDTO;
    const { id } = await this.eventService.createEvent({ description, totalTicketSlot, eventName, eventDate });

    sendSuccessResponse(res, HttpStatusCodes.CREATED, 'Event created successfully.', { id });
  });
}
