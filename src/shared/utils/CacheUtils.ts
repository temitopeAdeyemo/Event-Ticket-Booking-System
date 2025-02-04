import { generateOTP, minutesToSeconds } from '.';
import { v4 } from 'uuid';
import redisClient from '../services/Redis';
import AppError from './appError';

export class CacheUtils {
  private readonly OTP_EXPIRY = minutesToSeconds(15);
  private readonly redisClient = redisClient;
  cacheOtp(key: string) {
    const otp = generateOTP();
    const otpId = v4();
    const otpData = { id: otpId, otp };

    this.redisClient.set(key, JSON.stringify(otpData), this.OTP_EXPIRY);

    return { otp, otpId };
  }

  async validateOtp(key: string, otp: string, otpId: string) {
    const cachedData = await this.redisClient.get(key);

    if (cachedData == null) throw new AppError('Invalid or expired OTP.');

    const otpData: { otp: string; otpId: string } = JSON.parse(cachedData);

    if (otpData.otpId != otpId || otpData.otp != otp) throw new AppError('Invalid or expired OTP');

    return;
  }
}
