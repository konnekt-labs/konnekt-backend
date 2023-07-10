import { auth } from "./index";
export const verifyToken = async (token: string) => {
  try {
    const res = await auth.verifyIdToken(token);
    return res as VerifyTokenOutput;
  } catch (error) {
    console.log(error);
    throw new Error("Invalid token");
  }
};

type VerifyTokenOutput = {
  email?: string;
  picture?: string;
};
