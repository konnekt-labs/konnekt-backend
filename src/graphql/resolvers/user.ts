import { auth, getCurrentUser, getUserById } from "../../controllers/user";

const resolvers = {
  Query: {
    getUserById,
    getCurrentUser,
  },
  Mutation: {
    auth,
  },
};

export default resolvers;
