import { Booking } from '../../bookings/models/entity/Booking';
import { WaitList } from '../models/entity/Waitlist';

export interface IEventDTO {
  totalTicketSlot: number;
  eventName: string;
  eventDate: string;
  description: string;
  bookings: Booking[];
  waitList: WaitList[];
}
