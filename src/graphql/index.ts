import {
  createYoga,
  createSchema,
  YogaInitialContext,
  useLogger,
} from "graphql-yoga";
import { getGraphQlTypeDefs } from "./typedefs";
import { User, Post } from "../models";
import { PostResolver, UserResolver } from "./resolvers";
import { logFn } from "./logs";

const typeDefs = await getGraphQlTypeDefs();

const resolvers = [UserResolver, PostResolver];

export interface Context extends YogaInitialContext {
  dataSources: {
    UserModel: typeof User;
    PostModel: typeof Post;
  };
}

const getContext = (req: YogaInitialContext): Context => {
  const context: Context = {
    ...req,
    dataSources: {
      UserModel: User,
      PostModel: Post,
    },
  };
  return context;
};

const schema = createSchema<Context>({
  typeDefs,
  resolvers,
});

export const yogaServer = createYoga({
  context: getContext,
  schema,
  landingPage: false,
  logging: true,
  plugins: [
    useLogger({
      logFn,
    }),
  ],
});
