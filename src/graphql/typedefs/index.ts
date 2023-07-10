const BASE_PATH = "./src/graphql/typedefs";
export async function getGraphQlTypeDefs(): Promise<string[]> {
  const types = [];
  types.push(Bun.file(`${BASE_PATH}/user.graphql`).text());
  types.push(Bun.file(`${BASE_PATH}/posts.graphql`).text());

  return await Promise.all(types);
}
