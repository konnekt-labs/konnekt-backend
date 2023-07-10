import { ObjectId } from "bson";
import mongoose from "mongoose";

export const sharedWithEnum = ["PUBLIC", "PRIVATE", "FRIENDS"];
const contentTypeEnum = ["IMAGE", "VIDEO", "OBJECT"];

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Point"],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

const LocationMetadata = new mongoose.Schema({
  city: String,
  state: String,
  country: String,
  vectorIndex: Number,
  metadata: {},
});

interface IPost {
  _id: ObjectId;
  title?: string;
  hashtags: string[];
  contentType: "IMAGE" | "VIDEO" | "OBJECT";
  image?: string;
  video?: string;
  object?: string;
  sharedWith: "PUBLIC" | "PRIVATE" | "FRIENDS";
  sharedWithList: ObjectId[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  location: typeof pointSchema;
  locationMetaData: typeof LocationMetadata;
  views: number;
  userId: ObjectId;
}

const postSchema = new mongoose.Schema({
  _id: { type: mongoose.Types.ObjectId, auto: true },
  title: String,

  hashtags: [{ type: String, index: "text" }],

  contentType: { type: String, default: "IMAGE", enum: contentTypeEnum },
  image: { type: String, alias: "image_url" },
  video: { type: String, alias: "video_url" },
  object: { type: String, alias: "object_url", index: 1 },

  sharedWith: {
    type: String,
    default: "FRIENDS",
    enum: sharedWithEnum,
    index: 1,
  },

  sharedWithList: {
    type: [ObjectId],
    index: 1,
  },

  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, index: -1 },
  updatedAt: { type: Date, default: Date.now, index: -1 },

  location: {
    index: "2dsphere",
    sparse: true,
    type: pointSchema,
    required: true,
  },

  locationMetadata: { type: LocationMetadata, nullable: true },

  views: { type: Number, default: 0 },
  userId: { type: mongoose.Types.ObjectId },
});

export const Post = mongoose.model("Post", postSchema);
