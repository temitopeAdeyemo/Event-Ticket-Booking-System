import  { sign, verify } from 'jsonwebtoken';
import { jwtAccessTokenSecret, jwtRefreshTokenSecret } from '../../config/initEnv';
import AppError from '../utils/appError';
import { HttpStatusCodes } from '../utils/HttpStatusCodes';

class JwtClient {
  private accessTokenSecret: string;
  private refreshTokenSecret: string;

  constructor() {
    this.accessTokenSecret = jwtAccessTokenSecret;
    this.refreshTokenSecret = jwtRefreshTokenSecret;
  }

  /**
   * Generates an access token using the provided payload and the access token secret.
   * The token is signed with the secret and has an expiration time of 900000 milliseconds (15 minutes).
   *
   * @param payload - The payload containing the merchant data to be included in the token.
   * @returns The generated access token as a string.
   */
  generateAccessToken(payload: any) {
    return sign(payload, this.accessTokenSecret, { expiresIn: '900000' });
  }

  /**
   * Generates a refresh token using the provided payload and the refresh token secret.
   * The token is signed with the secret and has an expiration time of 1500 milliseconds (2.5 minutes).
   * The payload is extended with a 'type' property set to 'refresh'.
   *
   * @param payload - The payload containing the merchant data to be included in the token.
   * @returns The generated refresh token as a string.
   */
  generateRefreshToken(payload: any): string {
    payload.type = 'refresh';
    return sign(payload, this.refreshTokenSecret, { expiresIn: '1500' });
  }

  /**
   * Verifies the provided access token using the access token secret.
   *
   * @param token - The access token to be verified.
   * @returns The decoded payload of the token if it is valid, otherwise throws an AppError with status code 401.
   */
  verifyAccessToken(token: string): any {
    return verify(token, this.accessTokenSecret);
  }

  /**
   * Verifies the provided refresh token using the refresh token secret.
   *
   * @param token - The refresh token to be verified.
   * @returns The decoded payload of the token if it is valid, otherwise throws an AppError with status code 401.
   */
  verifyRefreshToken(token: any): any {
    if (token.type !== 'refresh') {
      throw new AppError('Invalid token type', HttpStatusCodes.FORBIDDEN);
    }
    return verify(token, this.refreshTokenSecret);
  }
}

export default JwtClient;
