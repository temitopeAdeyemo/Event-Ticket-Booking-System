import AppError from '../../../shared/utils/AppError';
import { HttpStatusCodes } from '../../../shared/utils/HttpStatusCodes';
import { BookingRepository } from '../models/repository';
import { injectable as Injectable, inject as Inject } from 'tsyringe';

@Injectable()
export class GetBookingService {
  constructor(@Inject(BookingRepository) private readonly bookingRepository: BookingRepository) {}

  public async fetchBooking(data: { userId: string; bookingId: string }, throwErrIfNotFound = true) {
    const booking = await this.bookingRepository.findOneByData({ user: { id: data.userId }, id: data.bookingId });

    if (!booking && throwErrIfNotFound) throw new AppError('Booking not found.', HttpStatusCodes.BAD_REQUEST);

    return booking;
  }

  public async fetchBookings(data: { userId: string }) {
    return await this.bookingRepository.findAll({ user: { id: data.userId } });
  }
}
