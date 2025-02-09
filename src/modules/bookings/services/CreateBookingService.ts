import AppError from '../../../shared/utils/AppError';
import { HttpStatusCodes } from '../../../shared/utils/HttpStatusCodes';
import { TransactionUtil } from '../../../shared/utils/TransactionUtil';
import { GetUserService } from '../../auth/services';
import { EventRepository, WaitListRepository } from '../../events/models/repository';
import { BookingRepository } from '../models/repository';
import { injectable as Injectable, inject as Inject } from 'tsyringe';

@Injectable()
export class CreateBookingService {
  constructor(
    @Inject(BookingRepository) private readonly bookingRepository: BookingRepository,
    @Inject(EventRepository) private readonly eventRepository: EventRepository,
    @Inject(GetUserService) private readonly getUserService: GetUserService,
    @Inject(WaitListRepository) private readonly waitListRepository: WaitListRepository
  ) {}

  public async createBooking(data: { userId: string; eventId: string }) {
    const user = await this.getUserService.findOne({ id: data.userId });

    return await TransactionUtil.transactional(async (queryRunner) => {
      const event = await this.eventRepository.findOneByDataAndLock(queryRunner, { id: data.eventId });

      if (!event) throw new AppError('Event not found.', HttpStatusCodes.BAD_REQUEST);

      const totalBookings = await this.bookingRepository.count({ event: { id: data.eventId } }, queryRunner);

      if (totalBookings + 1 > event!.totalTicketSlot) {
        const newWaitList = await this.waitListRepository.create({ event, user: user! }, false);
        await queryRunner.manager.save(newWaitList);
        return { bookingId: null, waitListId: newWaitList.id };
      }

      const newBooking = await this.bookingRepository.create({ user: user!, event }, false);
      await queryRunner.manager.save(newBooking);

      return { bookingId: newBooking.id, waitListId: null };
    });
  }
}
