import { IUserDTO } from 'modules/auth/dto';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Booking } from '../../../bookings/models/entity/Booking';
import { WaitList } from '../../../events/models/entity/Waitlist';

@Entity('User')
export class User implements IUserDTO {
  @Column({ primary: true, unique: true })
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  @Column({ nullable: true, length: 100, unique: true })
  public email: string;

  @Column({ nullable: true, length: 100 })
  public password: string;

  @Column({ nullable: true, length: 50, name: "full_name" })
  public fullName: string;

  @OneToMany(() => Booking, (booking) => booking.user, { eager: false, cascade: ['insert', 'update', 'remove'] })
  bookings: Booking[];

  @OneToMany(() => WaitList, (waitList) => waitList.user, { eager: false, cascade: ['insert', 'update', 'remove'] })
  waitListEntries: WaitList[];
}
