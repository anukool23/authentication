import jwt from "jsonwebtoken";
import VerificationCodeTypes from "../constants/VerificationCodeTypes";
import sessionModel from "../models/session.model";
import UserModel from "../models/user.model";
import verificationCodeModel from "../models/verificationCode.model";
import { oneYearFromNow } from "../utils/date";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";

export type CreateAccountParams = {
  email: string;
  password: string;
  userAgent?: string;
};

export const createAccount = async (data: CreateAccountParams) => {
  //verify if the user exists or not
  const existingUser = await UserModel.exists({
    email: data.email,
  });
  if (existingUser) {
    throw new Error("User already exists");
  }

  //create user
  const user = await UserModel.create({
    email: data.email,
    password: data.password,
  });

  //create verification code
  const verificationCode = await verificationCodeModel.create({
    userId: user._id,
    type: VerificationCodeTypes.EmailVerification,
    expiresAt: oneYearFromNow(),
  });

  //send verification code

  //create session
  const session = await sessionModel.create({
    userId: user._id,
    userAgent: data.userAgent,
  });

  //sign access token and refresh token
  const refreshToken = jwt.sign(
    { sessionId: session._id },
    JWT_REFRESH_SECRET,
    {
      audience: ["user"],
      expiresIn: "30d",
    }
  );

  const accessToken = jwt.sign(
    { userId: user._id, sessionId: session._id },
    JWT_SECRET,
    {
      audience: ["user"],
      expiresIn: "15m",
    }
  );

  //return user
  return {
    user,
    accessToken,
    refreshToken
  };
};
