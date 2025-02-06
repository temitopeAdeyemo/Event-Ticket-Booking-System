import { BookingModel } from '../entity/Booking';
import { AppRepository } from '../../../../shared/Helpers/AppRepository';

export default class BookingRepository extends AppRepository<BookingModel> {
  constructor() {
    super(BookingModel);
  }
}