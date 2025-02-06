import { IUserDTO } from 'modules/auth/dto';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Auth')
export class AuthModel implements IUserDTO {
  @Column({ primary: true, unique: true })
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  @Column({ nullable: true, length: 100, unique: true })
  public email: string;

  @Column({ nullable: true, length: 100 })
  public password: string;
}
