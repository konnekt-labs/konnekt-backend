import { GraphQLError } from "graphql";
import { Context } from "..";
import { IUser } from "../../models/User";
import { SignJWT, jwtDecrypt, jwtVerify } from "jose";
import { JWT_SECRET } from "../../utils/consts";
import { validateOid } from "../../utils/validateOId";

const JWT_EXPIRES_IN = "24d";
const JWT_HEADER = "authorization";
const PREFIX = "Bearer";

const getTokenFromHeader = (headers: Headers) => {
  const authHeader = headers.get(JWT_HEADER);
  if (!authHeader) {
    throw new GraphQLError("UnAuthorized");
  }
  return authHeader.replace(PREFIX + " ", "");
};

export const getUser = async (context: Context) => {
  const token = getTokenFromHeader(context.request.headers);
  const payload = await verifyToken(token);
  const { UserModel } = context.dataSources;
  const id = validateOid(payload._id);
  const user = await UserModel.findById(id);
  if (!user) {
    throw new GraphQLError("Invalid token");
  }
  return user as IUser;
};

export const getPayload = async (context: Context) => {
  const token = getTokenFromHeader(context.request.headers);
  const payload = await verifyToken(token);
  return payload;
};

interface UserInput {
  _id: string;
  username: string;
  email: string;
}

export const generateToken = async (userInput: UserInput) => {
  const { _id, email, username } = userInput;
  try {
    const token = new SignJWT({
      _id,
      email,
      username,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt(Date.now())
      .setExpirationTime(JWT_EXPIRES_IN)
      .sign(JWT_SECRET);
    return token;
  } catch (error) {
    console.log(error);
    throw new GraphQLError("Couldn't generate Token");
  }
};

const verifyToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!payload) {
      throw new GraphQLError("Unauthorized");
    }
    return {
      _id: payload._id,
      email: payload.email,
      username: payload.username,
    } as UserInput;
  } catch (error) {
    console.log(error);
    throw new GraphQLError("Unauthorized");
  }
};
