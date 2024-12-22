import jwt from "jsonwebtoken";
import VerificationCodeTypes from "../constants/VerificationCodeTypes";
import sessionModel from "../models/session.model";
import UserModel from "../models/user.model";
import verificationCodeModel from "../models/verificationCode.model";
import { ONE_DAY_MS, oneYearFromNow, thirtyDaysFromNow } from "../utils/date";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";
import appAssert from "../utils/appAssert";
import { CONFLICT, INTERNAL_SERVER_ERROR, NOT_FOUND, UNAUTHORIZED } from "../constants/http";
import {
  RefreshTokenPayload,
  refreshTokenSignOptions,
  signToken,
  verifyToken,
} from "../utils/jwt";

export type CreateAccountParams = {
  email: string;
  password: string;
  userAgent?: string;
};

export type loginParams = {
  email: string;
  password: string;
  userAgent?: string;
};

export const createAccount = async (data: CreateAccountParams) => {
  //verify if the user exists or not
  const existingUser = await UserModel.exists({
    email: data.email,
  });
  appAssert(!existingUser, CONFLICT, "Email already in use");

  //create user
  const user = await UserModel.create({
    email: data.email,
    password: data.password,
  });
  const userId = user._id;

  //create verification code
  const verificationCode = await verificationCodeModel.create({
    userId,
    type: VerificationCodeTypes.EmailVerification,
    expiresAt: oneYearFromNow(),
  });

  //send verification code

  //create session
  const session = await sessionModel.create({
    userId,
    userAgent: data.userAgent,
  });

  //Sign access token and refresh token
  const refreshToken = signToken(
    { sessionId: session._id },
    refreshTokenSignOptions
  );

  const accessToken = signToken({
    userId,
    sessionId: session._id,
  });

  //return user
  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  };
};

export const loginUser = async ({
  email,
  password,
  userAgent,
}: loginParams) => {
  //Get user by email
  const user = await UserModel.findOne({ email });
  appAssert(user, UNAUTHORIZED, "Invalid email or password");
  //Validate password
  const isValid = await user.comparePassword(password);
  appAssert(isValid, UNAUTHORIZED, "Invalid email or password");

  const userId = user._id;
  //Create a session
  const session = await sessionModel.create({
    userId,
    userAgent,
  });

  const sessionInfo = {
    sessionId: session._id,
  };
  //Sign access token and refresh token
  const refreshToken = signToken(sessionInfo, refreshTokenSignOptions);

  const accessToken = signToken({
    ...sessionInfo,
    userId: user._id,
  });
  //Return user and tokens
  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  };
};

export const refreshUserAccessToken = async (refreshToken: string) => {
  const { payload } = verifyToken<RefreshTokenPayload>(refreshToken, {
    secret: refreshTokenSignOptions.secret,
  });
  appAssert(payload, UNAUTHORIZED, "Invalid Access Token");

  const session = await sessionModel.findById(payload.sessionId);
  const now = Date.now();
  appAssert(
    session && session.expiresAt.getTime() > now,
    UNAUTHORIZED,
    "Session expired"
  );

  // Refresh the token if expiring in 24 hours
  const sessionNeedRefresh = session.expiresAt.getTime() - now <= ONE_DAY_MS;
  if (sessionNeedRefresh) {
    session.expiresAt = thirtyDaysFromNow();
    await session.save();
  }

  const newRefreshToken = sessionNeedRefresh
    ? signToken(
        {
          sessionId: session._id,
        },
        refreshTokenSignOptions
      )
    : undefined;

  const accessToken = signToken({
    userId: session.userId,
    sessionId: session._id,
  });

  return {
    accessToken,
    newRefreshToken,
  };
};

export const verifyEmail = async (code:string)=>{
    //get the verification code
    const validCode = await verificationCodeModel.findOne({
        _id:code,
        type:VerificationCodeTypes.EmailVerification,
        expiredAt:{$gt:new Date() },
    });
    appAssert(validCode, NOT_FOUND, "Invalid or expired verification code");

    //update the user to verified true
    const updatedUser = await UserModel.findByIdAndUpdate(
        validCode.userId,
        {verified:true},
        {new:true}
    );
    appAssert(updatedUser, INTERNAL_SERVER_ERROR, "Failed to verify Email");

    //delete verification code
    await validCode.deleteOne();

    return {
        user:updatedUser.omitPassword(),
    }
}
