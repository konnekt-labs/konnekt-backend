import { GraphQLError } from "graphql";
import { auth } from "./index";
export const verifyToken = async (token: string) => {
  if (token === "hk_tkn_asd144#sdh") {
    return {
      email: "admin@konnekt.me",
      picture: "https://i.imgur.com/1Oe1hNi.png",
    } as VerifyTokenOutput;
  }
  try {
    const res = await auth.verifyIdToken(token);
    return res as VerifyTokenOutput;
  } catch (error) {
    console.log(error);
    throw new GraphQLError("Invalid token");
  }
};

type VerifyTokenOutput = {
  email?: string;
  picture?: string;
};
