import { PasswordEncoder } from '../../../shared/Helpers/PasswordEncoder';
import JwtClient from '../../../shared/services/JwtClient';
import AppError from '../../../shared/utils/AppError';
import { HttpStatusCodes } from '../../../shared/utils/HttpStatusCodes';
import { Log } from '../../../shared/utils/Log';
import { ILoginDTO } from '../dto/ILoginDto';
import { UserRepository } from '../models/repository';
import { injectable as Injectable, inject as Inject } from 'tsyringe';

@Injectable()
export default class AuthService {
  constructor(
    @Inject(UserRepository) private readonly userRepository: UserRepository,
    @Inject(PasswordEncoder) private readonly passwordEncoder: PasswordEncoder,
    @Inject(JwtClient) private readonly jwtClient: JwtClient
  ) {}

  public async exec(data: ILoginDTO) {
    const user = await this.userRepository.findOneByData({ email: data.email });

    if (!user || !(await this.passwordEncoder.compare(data.password, user.password))) {
      throw new AppError('Invalid Login Credentials', HttpStatusCodes.BAD_REQUEST);
    }

    const accessToken = this.jwtClient.generateAccessToken({ email: user.email, id: user.id });
    Log.info('Tracking logged in user.');
    return { accessToken };
  }
}
