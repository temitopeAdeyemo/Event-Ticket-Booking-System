import { IBookDTO } from '../../dto/IBookings';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Bookings')
export class BookingModel implements IBookDTO {
  @Column({ primary: true, unique: true })
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  public eventId: string;
}
