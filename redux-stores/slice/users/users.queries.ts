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
  }`,
  findNearestUsers: `query FindNearestUsers($graphQlPageQuery: GraphQLLocationQuery!) {
  findNearestUsers(graphQLPageQuery: $graphQlPageQuery) {
    id
    username
    publicKey
    profilePicture
    name
    email
    followed_by
    following
  }
}`
}