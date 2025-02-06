import { User } from '../../../auth/models/entity/User';
import { EventModel } from '../../../events/models/entity/EventModel';
import { IBookDTO } from '../../dto/IBookings';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('Bookings')
export class Booking implements IBookDTO {
  @Column({ primary: true, unique: true })
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  @ManyToOne(() => EventModel, (event) => event.bookings, { eager: false })
  @JoinColumn({ name: 'event_id' })
  event: EventModel;

  @ManyToOne(() => User, (user) => user.bookings, { eager: false })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
