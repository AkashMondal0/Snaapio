export const AQ = {
  feedTimelineConnection: `query FeedTimelineConnection($graphQlPageQuery: GraphQLPageQuery!) {
    feedTimelineConnection(graphQLPageQuery: $graphQlPageQuery) {
      id
      content
      title
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
  }
  `,
  shortFeedTimelineConnection:`query FeedTimelineConnection($graphQlPageQuery: GraphQLPageQuery!) {
  shortFeedTimelineConnection(graphQLPageQuery: $graphQlPageQuery) {
     id
      content
      title
      fileUrl {
        width
        height
        square
        square_sm
        blur_square
        original
        original_sm
        blur_original
        shortVideoUrl
        shortVideoThumbnail
        type
        id
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
  }}`,
  createHighlight: `mutation CreateHighlight($createHighlightInput: createHighlightInput!) {
  createHighlight(createHighlightInput: $createHighlightInput) {
    __typename
  }}`,
}