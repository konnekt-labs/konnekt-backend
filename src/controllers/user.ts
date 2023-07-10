import { nanoid } from "nanoid/async";
import { Context } from "../graphql";
import { generateToken, getUser } from "../graphql/auth";
import { verifyToken } from "../utils/firebase/auth";
import { validateOid } from "../utils/validateOId";
import { IUser } from "../models/User";
import { GraphQLError } from "graphql";

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
    throw new GraphQLError("Email could not be found");
  }
  let user = await context.dataSources.UserModel.findOne({
    email: response.email,
    isDeleted: false,
  });
  if (!user) {
    user = new context.dataSources.UserModel({
      email: response.email,
      username: await nanoid(8),
      name: name,
      avatar: response.picture || "",
      friends: [],
      posts: [],
    });
    await user.save();
  }
  const userObject: IUser = user.toObject();
  userObject._id = String(userObject._id);
  console.log(userObject);
  const token = await generateToken({
    _id: String(user._id),
    email: user.email,
    username: user.username,
  });
  console.log(token);
  return {
    token,
    user: userObject,
  } as AuthPayload;
};
