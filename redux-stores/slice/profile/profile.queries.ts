export const QProfile = {
  findUserProfile: `query FindUserProfile($graphQlPageQuery: GraphQLPageQuery!) {
    findUserProfile(graphQLPageQuery: $graphQlPageQuery) {
      id
      username
      email
      name
      bio
      website
      profilePicture
      postCount
      followerCount
      followingCount
      friendship {
        followed_by
        following
      }
    }
  }`,
  findAllPosts: `query FindUserProfile($graphQlPageQuery: GraphQLPageQuery!) {
    findAllPosts(graphQLPageQuery: $graphQlPageQuery) {
      id
      fileUrl {
      id
      urls {
        low
        high
      }
      type
      caption
    }
      commentCount
      likeCount
    }
  }`,
  createFriendship: `mutation CreateFriendship($createFriendshipInput: CreateFriendshipInput!) {
    createFriendship(createFriendshipInput: $createFriendshipInput) {
      __typename
    }
  }`,
  destroyFriendship: `mutation DestroyFriendship($destroyFriendship: DestroyFriendship!) {
    destroyFriendship(destroyFriendship: $destroyFriendship) {
    __typename  
    }
  }`,
  RemoveFriendshipApi: `mutation DestroyFriendship($destroyFriendship: DestroyFriendship!) {
    destroyFriendship(destroyFriendship: $destroyFriendship) {
    __typename
    }
  }`,
  findAllFollowing: `query FindAllFollowing($graphQlPageQuery: GraphQLPageQuery!) {
    findAllFollowing(graphQLPageQuery: $graphQlPageQuery) {
      id
      username
      email
      name
      profilePicture
      followed_by
      following
    }
  }`,
  findAllFollower: `query FindAllFollower($graphQlPageQuery: GraphQLPageQuery!) {
    findAllFollower(graphQLPageQuery: $graphQlPageQuery) {
       id
       username
       email
       name
       profilePicture
       followed_by
       following
    }
  }`,
  findAllHighlight:`query FindAllHighlight($graphQlPageQuery: GraphQLPageQuery!) {
  findAllHighlight(graphQLPageQuery: $graphQlPageQuery) {
    authorId
    content
    createdAt
    id
    stories {
      content
      createdAt
      fileUrl {
        id
        urls {
          high
          medium
        }
        type
        caption
      }
      id
      song
    }
  }
}`
}
