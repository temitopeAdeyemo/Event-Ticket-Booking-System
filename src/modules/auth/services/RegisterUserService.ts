import { PasswordEncoder } from '../../../shared/Helpers/PasswordEncoder';
import { IUserDTO } from '../dto';
import { UserRepository } from '../models/repository';
import { injectable as Injectable, inject as Inject } from 'tsyringe';
import GetUserService from './GetUserService';
import AppError from '../../../shared/utils/AppError';
import { HttpStatusCodes } from '../../../shared/utils/HttpStatusCodes';

@Injectable()
export default class RegisterUserService {
  constructor(
    @Inject(UserRepository) private readonly userRepository: UserRepository,
    @Inject(PasswordEncoder) private readonly passwordEncoder: PasswordEncoder,
    @Inject(GetUserService) private readonly getUserService: GetUserService
  ) {}

  public async exec(data: IUserDTO) {
    const userExists = await this.getUserService.findOne({ email: data.email }, false);

    if (userExists) throw new AppError('Email Taken.', HttpStatusCodes.BAD_REQUEST);

    data.password = await this.passwordEncoder.hash(data.password);

    return await this.userRepository.create(data);
  }
}
