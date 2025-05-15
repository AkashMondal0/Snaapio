export const QUsers = {
  findUsersByKeyword: `query FindUsersByKeyword($graphQlPageQuery: GraphQLPageQuery!) {
    findUsersByKeyword(graphQLPageQuery: $graphQlPageQuery) {
      username
      profilePicture
      name
      id
      email
      publicKey
    }
  }`
}