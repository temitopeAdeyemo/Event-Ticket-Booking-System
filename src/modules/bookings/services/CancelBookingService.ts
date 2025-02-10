import AppError from '../../../shared/utils/AppError';
import { HttpStatusCodes } from '../../../shared/utils/HttpStatusCodes';
import { TransactionUtil } from '../../../shared/utils/TransactionUtil';
import { GetUserService } from '../../auth/services';
import { EventRepository, WaitListRepository } from '../../events/models/repository';
import { BookingRepository } from '../models/repository';
import { injectable as Injectable, inject as Inject } from 'tsyringe';

@Injectable()
export class CancelBookingService {
  constructor(
    @Inject(BookingRepository) private readonly bookingRepository: BookingRepository,
    @Inject(EventRepository) private readonly eventRepository: EventRepository,
    @Inject(GetUserService) private readonly getUserService: GetUserService,
    @Inject(WaitListRepository) private readonly waitListRepository: WaitListRepository
  ) {}

  public async cancelBooking(data: { userId: string; bookingId: string }) {
    const user = await this.getUserService.findOne({ id: data.userId });

    if (!user) throw new AppError('User not found.', HttpStatusCodes.NOT_FOUND);

    const booking = await this.bookingRepository.findOneByData({ user: { id: data.userId }, id: data.bookingId }, { event: true });

    if (!booking) throw new AppError('Booking not found.', HttpStatusCodes.BAD_REQUEST);

    const eventId = booking.event.id;

    return await TransactionUtil.transactional(async (queryRunner) => {
      const event = await this.eventRepository.findOneByDataAndLock(queryRunner, { id: eventId });

      if (!event) throw new AppError('Event not found.', HttpStatusCodes.NOT_FOUND);

      await this.bookingRepository.delete(booking!.id, queryRunner);
      console.log("****************************************************************:::",);
      const nextWaitlistedUser = await this.waitListRepository.findOneByDataAndLock(
        queryRunner,
        { event: { id: eventId } },
        { created_at: 'ASC' },
        { user: true },
        ['WaitLists']
      );
      console.log("****************************************************************", nextWaitlistedUser);
      if (!nextWaitlistedUser) return;

      const newBooking = await this.bookingRepository.create({ event, user: nextWaitlistedUser.user }, false);
      await queryRunner.manager.save(newBooking);

      await this.waitListRepository.delete(nextWaitlistedUser.id, queryRunner);
      return;
    });
  }
}
