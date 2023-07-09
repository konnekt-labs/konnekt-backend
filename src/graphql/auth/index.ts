import { GraphQLError } from "graphql";
import { Context } from "..";
import { IUser } from "../../models/User";
import jwt, { JwtPayload } from "jsonwebtoken";
import { verify } from "jsonwebtoken";
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
  const payload = verifyToken(token);
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
  const payload = verifyToken(token);
  return payload;
};

interface UserInput {
  _id: string;
  username: string;
  email: string;
}

const generateToken = (userInput: UserInput) => {
  const { _id, email, username } = userInput;
  const token = jwt.sign({ _id, email, username }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    algorithm: "ES256",
  });
  return token;
};

const verifyToken = (token: string) => {
  try {
    const payload = verify(token, JWT_SECRET, {
      algorithms: ["ES256"],
      complete: false,
    }) as JwtPayload;

    if (!payload.sub) {
      throw new GraphQLError("Unauthorized");
    }
    return JSON.parse(payload.sub) as UserInput;
  } catch (error) {
    throw new GraphQLError("Unauthorized");
  }
};
