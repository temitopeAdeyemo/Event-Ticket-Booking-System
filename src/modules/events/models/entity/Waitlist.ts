import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { IWaitListDTO } from '../../dto/IWaitListDTO';
import { User } from '../../../auth/models/entity/User';
import { EventModel } from './EventModel';

@Entity('WaitLists')
export class WaitList implements IWaitListDTO {
  @Column({ primary: true, unique: true })
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  @ManyToOne(() => EventModel, (event) => event.waitList, { eager: false })
  @JoinColumn({ name: 'event_id' })
  event: EventModel;

  @ManyToOne(() => User, (user) => user.waitListEntries, { eager: false })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
