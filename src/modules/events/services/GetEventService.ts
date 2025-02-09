import AppError from '../../../shared/utils/AppError';
import { HttpStatusCodes } from '../../../shared/utils/HttpStatusCodes';
import { EventRepository } from '../models/repository';

export class GetEventService {
  private eventRepository: EventRepository;

  constructor() {
    this.eventRepository = new EventRepository();
  }

  public async getEvent(data: { eventId: string }, throwErrIfNotFound: boolean = true) {
    const event = await this.eventRepository.findOneById(data.eventId);

    if (!event && throwErrIfNotFound) throw new AppError('Event not found.', HttpStatusCodes.NOT_FOUND);

    return event;
  }

  public async getEvents() {
    return await this.eventRepository.findAll({});
  }
}
