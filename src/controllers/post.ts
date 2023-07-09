import { GraphQLError, validate } from "graphql";
import { Context } from "../graphql";
import { getUser } from "../graphql/auth";
import { Post } from "../models";
import { validateOid } from "../utils/validateOId";
import { CreatePostInput } from "../utils/types";
import { grabHashtags } from "../utils/grabHashtags";

export const getAllPostsByUser = async (
  args: { page?: number; pageSize?: number },
  context: Context
) => {
  const user = await getUser(context);
  if (!args.page) {
    args.page = 1;
  }
  if (!args.pageSize) {
    args.pageSize = 20;
  }
  try {
    const posts = await Post.find({
      $or: [
        {
          userId: {
            $in: user.friends,
          },
          sharedWith: "FRIENDS",
        },
        {
          sharedWith: "PUBLIC",
        },
      ],
      isDeleted: false,
    })
      .sort([["createdAt", -1]])
      .skip(args.pageSize * args.page)
      .limit(args.pageSize);
    return posts;
  } catch (error) {
    return new GraphQLError(`Couldnt fetch posts.`);
  }
};

export const getPostById = async (
  parent: any,
  { _id }: { _id: string },
  context: Context
) => {
  const user = await getUser(context);
  const id = validateOid(_id);
  try {
    const post = await Post.findById(id);
    return post;
  } catch (error) {
    throw new Error(`Failed to fetch post with id: ${_id}. Error: ${error}`);
  }
};

export const createPost = async (
  parent: any,
  { input }: { input: CreatePostInput },
  context: Context
) => {
  const user = await getUser(context);
  input.user = user;
  input.sharedWithList = user.friends;
  try {
    if (input.title) input.hashtags = grabHashtags(input.title);
    const post = await Post.create(input);
    return post;
  } catch (error) {
    throw new Error("Failed to create post");
  }
};

export const updatePost = async (
  parent: any,
  { _id, input }: { _id: string; input: Partial<CreatePostInput> },
  context: Context
) => {
  const user = await getUser(context);
  const id = validateOid(_id);
  try {
    input.user = user;
    const post = await Post.updateOne(
      {
        _id: id,
        isDeleted: false,
        user: user._id,
      },
      {
        $set: input,
      }
    );
    return post.acknowledged;
  } catch (error) {
    throw new Error("Failed to create post");
  }
};

export const deletePost = async (
  parent: any,
  { _id }: { _id: string },
  context: Context
) => {
  const user = await getUser(context);
  const id = validateOid(_id);
  try {
    const post = await Post.deleteOne({
      _id: id,
      isDeleted: false,
      user: user._id,
    });
    return post.acknowledged;
  } catch (error) {
    throw new Error("Failed to delete post");
  }
};