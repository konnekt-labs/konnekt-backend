import { createYoga, createSchema, YogaInitialContext } from "graphql-yoga";
import { getGraphQlTypeDefs } from "./typedefs";
import { User, Post } from "../models";
import { PostResolver, UserResolver } from "./resolvers";

const typeDefs = await getGraphQlTypeDefs();

const resolvers = [PostResolver, UserResolver];

export interface Context extends YogaInitialContext {
  dataSources: {
    UserModel: typeof User;
    PostModel: typeof Post;
  };
}

const getContext = (req: YogaInitialContext) => {
  return {
    ...req,
    dataSources: {
      UserModel: User,
      PostModel: Post,
    },
  };
};

const schema = createSchema<Context>({
  typeDefs,
  resolvers,
});

export const yogaServer = createYoga({
  schema,
  landingPage: false,
  logging: true,
  context: getContext,
});
