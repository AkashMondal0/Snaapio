import { GraphqlQueryType } from "@/lib/GraphqlQuery"


export const FeedQuery: GraphqlQueryType = {
  name: "feedTimelineConnection",
  operation: "query",
  query: `query FeedTimelineConnection($limitAndOffset: GraphQLPageQuery!) {
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
  }
  `,
}

export const UpdateProfileQuery: GraphqlQueryType = {
  name: "updateUserProfile",
  operation: "mutation",
  query: `mutation UpdateUserProfile($updateUsersInput: UpdateUsersInput!) {
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
