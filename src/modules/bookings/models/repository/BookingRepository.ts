import { Booking } from '../entity/Booking';
import { AppRepository } from '../../../../shared/Helpers/AppRepository';

export default class BookingRepository extends AppRepository<Booking> {
  constructor() {
    super(Booking);
  }
}