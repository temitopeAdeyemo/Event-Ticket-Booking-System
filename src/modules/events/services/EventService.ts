import AppError from '../../../shared/utils/AppError';
import { HttpStatusCodes } from '../../../shared/utils/HttpStatusCodes';
import { BookingRepository } from '../../bookings/models/repository';
import { IEventDTO } from '../dto';
import { EventRepository, WaitListRepository } from '../models/repository';

export class EventService {
  private eventRepository: EventRepository;
  private waitListRepository: WaitListRepository;
  private bookingRepository: BookingRepository;

  constructor() {
    this.eventRepository = new EventRepository();
    this.waitListRepository = new WaitListRepository();
    this.bookingRepository = new BookingRepository();
  }

  public async createEvent(data: Partial<IEventDTO>) {
    const event = await this.eventRepository.create(data);
    return event;
  }

  public async getEvent(id: string, throwErrIfNotFound: boolean = true) {
    const event = await this.eventRepository.findOneById(id);

    if (!event && throwErrIfNotFound) throw new AppError('Event not found.', HttpStatusCodes.NOT_FOUND);

    return event;
  }

  public async eventStatus(eventId: string) {
    const eventData = await this.getEvent(eventId);
    const totalBookings = await this.bookingRepository.count({ event: { id: eventId } });

    const waitingListCount = await this.waitListRepository.count({ event: { id: eventId } });
    let availableTickets: number;

    if (waitingListCount > 0) availableTickets = 0;
    else availableTickets = eventData!.totalTicketSlot - totalBookings;

    return { availableTickets: availableTickets.toString(), waitingListCount: waitingListCount.toString() };
  }
}
