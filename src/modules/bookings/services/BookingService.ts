import AppError from '../../../shared/utils/AppError';
import { HttpStatusCodes } from '../../../shared/utils/HttpStatusCodes';
import { TransactionUtil } from '../../../shared/utils/TransactionUtil';
import { GetUserService } from '../../auth/services';
import { EventRepository, WaitListRepository } from '../../events/models/repository';
import { BookingRepository } from '../models/repository';

export class BookingService {
  private bookingRepository: BookingRepository;
  private eventRepository: EventRepository;
  private getUserService: GetUserService;
  private waitListRepository: WaitListRepository;

  constructor() {
    this.bookingRepository = new BookingRepository();
    this.eventRepository = new EventRepository();
    this.getUserService = new GetUserService();
    this.waitListRepository = new WaitListRepository();
  }

  public async createBooking(data: { userId: string; eventId: string }) {
    await TransactionUtil.transactional(async (queryRunner) => {
      const user = await this.getUserService.findOne({ id: data.userId });

      const event = await this.eventRepository.findOneByDataAndLock(queryRunner, { id: data.eventId });

      if (!event) throw new AppError('Event not found.', HttpStatusCodes.BAD_REQUEST);

      const totalBookings = await this.bookingRepository.count({ event: { id: event.id } });

      if (totalBookings + 1 > event!.totalTicket) {
        const newWaitList = await this.waitListRepository.create({ event, user: user! }, false);

        await queryRunner.manager.save(newWaitList);

        return { id: null };
      }

      const newBooking = await this.bookingRepository.create({ user: user!, event }, false);

      await queryRunner.manager.save(newBooking);

      return { id: newBooking.id };
    });
  }
}
