import {
  createPost,
  deletePost,
  getAllPostsByUser,
  getPostById,
  updatePost,
} from "../../controllers/post";
const resolvers = {
  Query: {
    getAllPostsByUser,
    getPostById,
  },
  Mutation: {
    createPost,
    updatePost,
    deletePost,
  },
};

export default resolvers;
