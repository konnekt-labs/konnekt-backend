import { Double } from "bson";
import { ObjectId } from "mongoose";
import { IUser } from "../models/User";

export enum SharedWith {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
  FRIENDS = "FRIENDS",
}

enum ContentType {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  OBJECT = "OBJECT",
}

export type PointInput = {
  type: string;
  coordinates: Double[];
};

export interface CreatePostInput {
  sharedWithList: import("mongoose").Schema.Types.ObjectId[] | String[];
  title?: string;
  hashtags?: string[];
  contentType: ContentType;
  image?: string;
  video?: string;
  object?: string;
  sharedWith: SharedWith;
  location: Double[] | PointInput;
  locationMetadata?: LocationMetadataInput;
  user?: ObjectId | String;
}

export type LocationMetadataInput = {
  city: string;
  state: string;
  country: string;
  vectorIndex: number;
  metadata: object;
};
