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
  findAllPosts: `query FindAllPosts($graphQlPageQuery: GraphQLPageQuery!) {
    findAllPosts(graphQLPageQuery: $graphQlPageQuery) {
      id
      fileUrl {
      width
      height
      square
      square_sm
      blur_square
      original
      original_sm
      blur_original
      type
      id
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
  findAllHighlight: `query FindAllHighlight($graphQlPageQuery: GraphQLPageQuery!) {
  findAllHighlight(graphQLPageQuery: $graphQlPageQuery) {
    authorId
    content
    createdAt
    id
    stories {
      content
      createdAt
      fileUrl {
        width
      height
      square
      square_sm
      blur_square
      original
      original_sm
      blur_original
      type
      id
      }
      id
      song
    }
  }
}`
}
