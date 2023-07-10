import { nanoid } from "nanoid/async";
import { Context } from "../graphql";
import { generateToken, getUser } from "../graphql/auth";
import { verifyToken } from "../utils/firebase/auth";
import { validateOid } from "../utils/validateOId";
import { IUser } from "../models/User";

export const getCurrentUser = async (context: Context) => {
  const user = await getUser(context);
  return user;
};

export const getUserById = async (
  parent: any,
  { _id }: { _id: string },
  context: Context
) => {
  const id = validateOid(_id);
  const currUser = await getUser(context);
  const user = await context.dataSources.UserModel.findOne({
    isDeleted: false,
    _id: id,
    friends: {
      $in: [currUser._id],
    },
  });
  return user;
};

type AuthUserInput = {
  firebaseToken: string;
  name?: string;
};

type AuthPayload = {
  token: string;
  user: IUser;
};

export const auth = async (
  parent: any,
  { firebaseToken, name }: AuthUserInput,
  context: Context
) => {
  const response = await verifyToken(firebaseToken);
  if (!response.email) {
    throw new Error("Email could not be found");
  }
  const user = await context.dataSources.UserModel.findOneAndUpdate(
    {
      email: response.email,
      isDeleted: false,
    },
    {
      $setOnInsert: {
        avatar: response.picture,
        name: name,
        email: response.email,
        friends: [],
        isDeleted: false,
        username: await nanoid(10),
      },
    }
  );
  if (!user) {
    throw new Error("Failed to create user");
  }
  const token = generateToken({
    _id: String(user._id),
    email: user.email,
    username: user.username,
  });
  return {
    token,
    user,
  } as AuthPayload;
};
