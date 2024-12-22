import jwt from "jsonwebtoken";
import VerificationCodeTypes from "../constants/VerificationCodeTypes";
import sessionModel from "../models/session.model";
import UserModel from "../models/user.model";
import verificationCodeModel from "../models/verificationCode.model";
import { oneYearFromNow } from "../utils/date";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";
import appAssert from "../utils/appAssert";
import { CONFLICT, UNAUTHORIZED } from "../constants/http";
import { refreshTokenSignOptions, signToken } from "../utils/jwt";

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
appAssert(!existingUser, CONFLICT, "Email already in use")


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
   { sessionId:session._id},
    refreshTokenSignOptions
)

const accessToken = signToken({
    userId,
    sessionId:session._id
  })

  //return user
  return {
    user:user.omitPassword(),
    accessToken,
    refreshToken
  };
};



export const  loginUser = async ({email,password,userAgent}:loginParams)=>{
    //Get user by email
    const user = await UserModel.findOne({email});
    appAssert(user, UNAUTHORIZED, "Invalid email or password")
    //Validate password
    const isValid = await user.comparePassword(password);
    appAssert(isValid, UNAUTHORIZED, "Invalid email or password");

    const userId = user._id;
    //Create a session
    const session = await sessionModel.create({
        userId,
        userAgent,
    });

    const sessionInfo= {
        sessionId:session._id,
    }
    //Sign access token and refresh token
    const refreshToken = signToken(
        sessionInfo,refreshTokenSignOptions
    )
    
    const accessToken = signToken({
        ...sessionInfo,
        userId:user._id
      })
    //Return user and tokens
    return {
        user:user.omitPassword(),
        accessToken,
        refreshToken
      };
};
