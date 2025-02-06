import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IWaitListDTO } from '../../dto/IWaitListDTO';

@Entity('WaitLists')
export class WaitList implements IWaitListDTO {
  @Column({ primary: true, unique: true })
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;
}
