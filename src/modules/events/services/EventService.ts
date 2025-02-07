import AppError from '../../../shared/utils/AppError';
import { HttpStatusCodes } from '../../../shared/utils/HttpStatusCodes';
import { IEventDTO } from '../dto';
import { EventRepository } from '../models/repository';

export class EventService {
  private eventRepository: EventRepository;

  constructor() {
    this.eventRepository = new EventRepository();
  }

  public async createEvent(data: Partial<IEventDTO>) {
  
    const event =  await this.eventRepository.create(data);
    return event;
  }

  public async getEvent(id: string, throwErrIfNotFound: boolean = true) {
    const event = await this.eventRepository.findOneById(id);

    if (!event && throwErrIfNotFound) throw new AppError('Event not found.', HttpStatusCodes.NOT_FOUND);

    return event;
  }
}
