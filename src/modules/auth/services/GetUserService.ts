import AppError from '../../../shared/utils/AppError';
import { HttpStatusCodes } from '../../../shared/utils/HttpStatusCodes';
import { IUserDTO } from '../dto';
import { UserRepository } from '../models/repository';
import { injectable as Injectable, inject as Inject } from 'tsyringe';

@Injectable()
export default class GetUserService {
  constructor(@Inject(UserRepository) private readonly userRepository: UserRepository) {}

  public async findOne(data: Partial<IUserDTO>, throwErrIfNotFound = true) {
    const user = await this.userRepository.findOneByData(data);

    if (!user && throwErrIfNotFound) throw new AppError('User not found.', HttpStatusCodes.BAD_REQUEST);

    return user;
  }
}
