import bcrypt from 'bcryptjs';
import { saltRounds } from '../../config';

export class BcryptCLient {
  saltRounds: string | number;
  constructor() {
    this.saltRounds = saltRounds;
  }

  async hash(data: string): Promise<string> {
    const hashedData = await bcrypt.hash(data, this.saltRounds);
    return hashedData;
  }

  async compare(data: string, hashedData: string): Promise<boolean> {
    const comparedData = await bcrypt.compare(data, hashedData);
    return comparedData;
  }
}
