import { GraphQLError } from "graphql";
import { ObjectId } from "bson";

export function validateOid(oid: string) {
  try {
    const id = new ObjectId(oid);
    return id;
  } catch (error) {
    throw new GraphQLError(`Invalid ID: ${oid}`);
  }
}

export function validateOidList(oids: string[]) {
  return oids.map((oid) => {
    return validateOid(oid);
  });
}
