import { z } from 'zod';
import { env } from '../env';
import { err, ok, type Result } from '@libs/shared';
import type mongoose from 'mongoose';
import type { IncomingHttpHeaders } from 'http';
import type { Model } from 'mongoose';
import type { User } from 'src/schemas';
import { create } from './db';
import { emailSchema } from '@libs/api';
import { type JwtService, TokenExpiredError } from '@nestjs/jwt';

/**
 * Possible errors from auth logic.
 */
export const AuthErrors = {
  emailTaken: 'Email already taken!',
  emailNotExist: "Email doesn't exist!",
  wrongPassword: 'Wrong password!',
  wrongToken: 'Token is incorrect!',
  sessionExpired: 'Session expired! Log again!',
} as const satisfies Record<string, string>;

/* Schemas */

export const authTokenDataSchema = z.object({
  email: emailSchema,
});

export type AuthTokenData = z.infer<typeof authTokenDataSchema>;

export const userCredentialsSchema = z.object({
  email: emailSchema,
  password: z.string(),
});

export type UserCredentials = z.infer<typeof userCredentialsSchema>;

/* DB helpers */

const findUser = async (
  db: Model<User>,
  user: AuthTokenData,
): Promise<User | null> =>
  await db.findOne(authTokenDataSchema.strip().parse(user));

const createUser = async (
  db: Model<User>,
  user: User,
): Promise<
  Result<
    User,
    mongoose.Error.ValidationError | (typeof AuthErrors)['emailTaken']
  >
> => {
  const foundUser = await findUser(db, user);
  if (foundUser != null) return err(AuthErrors.emailTaken);
  return await create(db, user);
};

/* Token API */

const _tokenSchema = z.string().min(1);

export const tokenSchema = _tokenSchema.brand('Token');
/**
 * Verified JWT Token
 */
export type Token = z.infer<typeof tokenSchema>;

export const tokenUnverifiedSchema = _tokenSchema.brand('TokenUnverified');
/**
 * Unverified JWT Token
 */
export type TokenUnverified = z.infer<typeof tokenUnverifiedSchema>;

/**
 * Extract Token from http headers
 * @param headers http headers
 * @returns Unverified token or `null`
 */
export const extractToken = (
  headers: IncomingHttpHeaders,
): TokenUnverified | null => {
  const authHeader = headers.authorization;
  if (authHeader) {
    const [bear, token] = authHeader.split(' ');
    if (bear !== 'Bearer') return null;
    return token ? (token as TokenUnverified) : null;
  }
  return null;
};

/**
 * Creates a new verified token for the given user data
 * @param user user data needed for token
 * @returns Verified token
 */
export const createToken = (jwt: JwtService, user: AuthTokenData): Token => {
  // just for safety strip usr of any garbage
  return jwt.sign(authTokenDataSchema.strip().parse(user), {
    secret: env.AUTH_SECRET,
    expiresIn: env.TOKEN_AGE,
  }) as Token;
};

export type UserWithToken = {
  user: User;
  token: Token;
};

/**
 * Type-safe and exception-safe wrapper around jwt.verify
 * @param token JWT token
 * @returns payload or `null`
 */
const jwtSafeVerify = (jwt: JwtService, token: TokenUnverified | Token) => {
  try {
    return ok(
      jwt.verify(token, {
        secret: env.AUTH_SECRET,
        maxAge: env.TOKEN_AGE,
      }) as Record<string, unknown> & { iat?: number; exp?: number },
    );
  } catch (e) {
    if (e instanceof TokenExpiredError) return err(AuthErrors.sessionExpired);
    return err(AuthErrors.wrongToken);
  }
};

/**
 * Verify that token is correct and not expired
 * @param token JWT Token
 * @returns `Result` with `UserWithToken` on success or reason on error
 */
export const verifyToken = async (
  jwt: JwtService,
  db: Model<User>,
  token: TokenUnverified | Token,
): Promise<
  Result<UserWithToken, (typeof AuthErrors)['wrongToken' | 'sessionExpired']>
> => {
  const maybe_payload = jwtSafeVerify(jwt, token);
  if (!maybe_payload.success) return maybe_payload;
  const result = authTokenDataSchema.safeParse(maybe_payload.data);
  if (!result.success) return err(AuthErrors.wrongToken);
  const user = await findUser(db, result.data);
  if (user == null) return err(AuthErrors.wrongToken);
  return ok({ user, token: token as Token });
};

/* User API */

/**
 * API to log in an existing user
 * @param cred user credentials
 * @returns `Result` with `User` and `Token` on success or reason on error
 */
export const login = async (
  jwt: JwtService,
  db: Model<User>,
  cred: UserCredentials,
) => {
  const user = await findUser(db, cred);
  if (user == undefined) {
    return err(AuthErrors.emailNotExist);
  }
  if (cred.password != user.password) {
    return err(AuthErrors.wrongPassword);
  }
  const token = createToken(jwt, cred);
  // WARN: we shouldn't move user around with his password dangling but it's fine for this demo app
  return ok({ user, token });
};

/**
 * API to sign up a new user
 * @param user `User` object
 * @returns `Result` with `User` and `Token` on success or reason on error
 */
export const signup = async (jwt: JwtService, db: Model<User>, user: User) => {
  const result = await createUser(db, user);
  if (!result.success) return result;
  const token = createToken(jwt, result.data);
  // WARN: we shouldn't move user around with his password dangling but it's fine for this demo app
  return ok({ user: result.data, token });
};
