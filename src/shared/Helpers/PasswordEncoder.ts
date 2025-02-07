import { BcryptCLient } from '../services/BcryptClient';

export class PasswordEncoder {
  private bcryptCLient: BcryptCLient;
  constructor() {
    this.bcryptCLient = new BcryptCLient();
  }

  async hash(data: string): Promise<string> {
    const hashedData = await this.bcryptCLient.hash(data);
    return hashedData;
  }

  async compare(data: string, hashedData: string): Promise<boolean> {
    const comparedData = await this.bcryptCLient.compare(data, hashedData);
    return comparedData;
  }
}
