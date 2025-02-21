export const AQ = {
  feedTimelineConnection: `query FeedTimelineConnection($graphQlPageQuery: GraphQLPageQuery!) {
    feedTimelineConnection(graphQLPageQuery: $graphQlPageQuery) {
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
  findStory: `query FindStory($graphQlPageQuery: GraphQLPageQuery!) {
  findStory(graphQLPageQuery: $graphQlPageQuery) {
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
  storyTimelineConnection: `query StoryTimelineConnection($graphQlPageQuery: GraphQLPageQuery!) {
  storyTimelineConnection(graphQLPageQuery: $graphQlPageQuery) {
    id
    name
    lastStatusUpdate
    profilePicture
    username
  }}`,
  findAllStory: `query FindAllStory($graphQlPageQuery: GraphQLPageQuery!) {
  findAllStory(graphQLPageQuery: $graphQlPageQuery) {
    content
    authorId
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
  }}`,
  createHighlight: `mutation CreateHighlight($createHighlightInput: createHighlightInput!) {
  createHighlight(createHighlightInput: $createHighlightInput) {
    __typename
  }}`,
}