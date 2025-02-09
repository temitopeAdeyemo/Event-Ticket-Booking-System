import { User } from '../../../auth/models/entity/User';
import { EventModel } from '../../../events/models/entity/EventModel';
import { IBookDTO } from '../../dto/IBookings';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('Bookings')
export class Booking implements IBookDTO {
  @Column({ primary: true, unique: true })
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  @Index()
  @ManyToOne(() => EventModel, (event) => event.bookings, { eager: false })
  @JoinColumn({ name: 'event_id' })
  event: EventModel;

  @ManyToOne(() => User, (user) => user.bookings, { eager: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  public created_at: Date | any;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
  public updated_at: Date | any;

  @DeleteDateColumn({ name: 'deleted_at' })
  public deleted_at: Date | any;
}
