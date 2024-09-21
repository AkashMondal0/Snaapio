export const AQ = {
  feedTimelineConnection: `query FeedTimelineConnection($limitAndOffset: GraphQLPageQuery!) {
    feedTimelineConnection(limitAndOffset: $limitAndOffset) {
      id
      content
      title
      fileUrl
      createdAt
      updatedAt
      authorId
      commentCount
      likeCount
      is_Liked
      user {
        id
        username
        email
        name
        profilePicture
      }
    }
  }`,
  updateUserProfile: `mutation UpdateUserProfile($updateUsersInput: UpdateUsersInput!) {
    updateUserProfile(UpdateUsersInput: $updateUsersInput) {
      profilePicture
      name
      id
      email
      username
      bio
      website
    }
  }`,
}