import bcrypt from "bcryptjs";
import { saltRounds } from "../../config/initEnv";

class Bcrypt {
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
export default Bcrypt;
