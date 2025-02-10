import { DEFAULT_USER_EMAIL, DEFAULT_USER_PASSWORD } from '.';
import { GetUserService, RegisterUserService } from '../modules/auth/services';
import JwtClient from '../shared/services/JwtClient';
import { Log } from '../shared/utils/Log';
import { injectable as Injectable, inject as Inject } from 'tsyringe';

@Injectable()
export class Seedings {
  constructor(
    @Inject(RegisterUserService) private readonly registerUserService: RegisterUserService,
    @Inject(GetUserService) private readonly getUserService: GetUserService,
    @Inject(JwtClient) private readonly jwtClient: JwtClient
  ) {}

  public async exec() {
    try {
      let user = await this.getUserService.findOne({ email: DEFAULT_USER_EMAIL! }, false);

      if (!user) {
        user = await this.registerUserService.exec({
          email: DEFAULT_USER_EMAIL!,
          password: DEFAULT_USER_PASSWORD!,
          fullName: 'Test Test',
        });
      }

      const accessToken = this.jwtClient.generateAccessToken({ email: user.email, id: user.id });

      return {
        message: `A default user and access token has been generated for testing purposes.\nEmail: ${DEFAULT_USER_EMAIL}\nPassword: ${DEFAULT_USER_PASSWORD}\naccess_token: ${accessToken}`,
      };
    } catch (error) {
      console.log("********************************");
      console.log(error);
      Log.error(error);
      process.exit(1);
    }
  }
}
