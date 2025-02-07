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

  public initialize = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { description, totalTicket, eventName } = req.body as IEventDTO;
    const { id } = await this.eventService.createEvent({ description, totalTicket, eventName });

    sendSuccessResponse(res, HttpStatusCodes.CREATED, 'Event created successfully.', { id });
  });
}
