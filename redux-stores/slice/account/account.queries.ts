export const AQ = {
  feedTimelineConnection: `query FeedTimelineConnection($limitAndOffset: GraphQLPageQuery!) {
    feedTimelineConnection(limitAndOffset: $limitAndOffset) {
      id
      content
      title
      fileUrl {
      id
      urls {
        low
        high
      }
      type
      caption
    }
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
  createPost: `mutation CreatePost($createPostInput: CreatePostInput!) {
    createPost(createPostInput: $createPostInput) {
      updatedAt
      title
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
      createdAt
      content
      username
      authorId
    }
  }`,
  createStory: `mutation CreateStory($createStoryInput: CreateStoryInput!) {
  createStory(createStoryInput: $createStoryInput) {
    __typename
  }}`,
  findStory: `query FindStory($findStoryId: String!) {
  findStory(id: $findStoryId) {
    id
    song
    expiresAt
    authorId
    createdAt
    content
    fileUrl {
      id
      urls {
        low
        medium
        high
      }
      type
      caption
    }
  }}`,
  storyTimelineConnection: `query StoryTimelineConnection($limitAndOffset: GraphQLPageQuery!) {
  storyTimelineConnection(limitAndOffset: $limitAndOffset) {
    id
    name
    lastStatusUpdate
    profilePicture
    username
  }
  }`,
}