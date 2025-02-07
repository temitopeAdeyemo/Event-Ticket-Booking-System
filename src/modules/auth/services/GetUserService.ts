import { IUserDTO } from '../dto';
import { UserRepository } from '../models/repository';

export default class GetUserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  public async findOne(data: Partial<IUserDTO>, throwErrIfNotFound = true) {
    const user = await this.userRepository.findOneByData(data);
    
    if (!user && throwErrIfNotFound) {
      throw new Error('User not found.');
    }
    user?.bookings
    return user;
  }
}
