import { yogaServer } from "./graphql";
import { PORT } from "./utils/consts";
import mongoose from "mongoose";
import { MONGO_URI } from "./utils/consts";

console.log("🚀 Starting server...");
await mongoose.connect(MONGO_URI);
console.log("🚀 Connected to database");

const server = Bun.serve(yogaServer);

console.info(
  `🚀 Server is running on ${new URL(
    yogaServer.graphqlEndpoint,
    `http://${server.hostname}:${server.port}`
  )}`
);
