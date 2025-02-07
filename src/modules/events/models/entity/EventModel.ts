import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { IEventDTO } from '../../dto/IEvent';
import { Booking } from '../../../bookings/models/entity/Booking';
import { WaitList } from './Waitlist';

@Entity('Events')
export class EventModel implements IEventDTO {
  @Column({ primary: true, unique: true })
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  @Column({ nullable: true, length: 50, name: 'event_name' })
  eventName: string;

  @Column({ nullable: true, length: 250 })
  description: string;

  @Column({ nullable: true })
  totalTicket: number;

  @OneToMany(() => Booking, (booking) => booking.event, { eager: false, cascade: ['insert', 'update', 'remove'] })
  bookings: Booking[];

  @OneToMany(() => WaitList, (waitList) => waitList.event, { eager: false, cascade: ['insert', 'update', 'remove'] })
  waitList: WaitList[];

  soldTicket: number;
}
