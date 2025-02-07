import { Booking } from '../../bookings/models/entity/Booking';
import { WaitList } from '../../events/models/entity/Waitlist';

export interface IUserDTO {
  id?: string;
  email: string;
  password: string;
  fullName: string;
  bookings?: Booking[];
  waitListEntries?: WaitList[];
}
