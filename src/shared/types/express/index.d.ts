export {};

declare global {
  namespace Express {
    export interface Request {
      currentUser?: AuthUserPayload;
    }
  }
}

export interface AuthUserPayload {
  email: string;
  id: string;
}