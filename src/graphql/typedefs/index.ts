const BASE_PATH = "./src/graphql/typedefs";
export async function getGraphQlTypeDefs(): Promise<string> {
  const userTypeDef = Bun.file(`${BASE_PATH}/user.graphql`);
  const postTypeDef = Bun.file(`${BASE_PATH}/posts.graphql`);
  return await postTypeDef.text();
}
