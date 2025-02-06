import { Booking } from '../../bookings/models/entity/Booking';
import { WaitList } from '../models/entity/Waitlist';

export interface IEventDTO {
  totalTicket: number;
  eventName: string;
  description: string;
  bookings: Booking[];
  waitList: WaitList[];
}
