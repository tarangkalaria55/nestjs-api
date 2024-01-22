import { ObjectId } from 'bson';

export type JwtConfig = {
  secret: string;
  expiresIn: string;
};

export type Payload = {
  sub: ObjectId;
  email: string;
};

// export const accessTokenConfig = (): JwtConfig => ({
//   secret: process.env.ACCESS_TOKEN_SECRET,
//   expiresIn: '1h',
// });
