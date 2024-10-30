export const QProfile = {
  findUserProfile: `query FindUserProfile($username: String!) {
    findUserProfile(username: $username) {
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
  findAllPosts: `query FindUserProfile($findAllPosts: GraphQLPageQuery!) {
    findAllPosts(findAllPosts: $findAllPosts) {
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
  findAllFollowing: `query FindAllFollowing($viewFollowingInput: GraphQLPageQuery!) {
    findAllFollowing(viewFollowingInput: $viewFollowingInput) {
      id
      username
      email
      name
      profilePicture
      followed_by
      following
    }
  }`,
  findAllFollower: `query FindAllFollower($viewFollowerInput: GraphQLPageQuery!) {
    findAllFollower(viewFollowerInput: $viewFollowerInput) {
       id
       username
       email
       name
       profilePicture
       followed_by
       following
    }
  }`,
  findAllHighlight:`query FindAllHighlight($limitAndOffset: GraphQLPageQuery!) {
  findAllHighlight(limitAndOffset: $limitAndOffset) {
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
