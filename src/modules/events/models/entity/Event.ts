import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IEventDTO } from '../../dto/IEvent';

@Entity('Events')
export class Event implements IEventDTO {
  @Column({ primary: true, unique: true })
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  @Column({ nullable: true })
  totalTicket: number;

  @Column({ nullable: true, length: 100 })
  availableTicket: number;
}
