const QueryN = {
  createNotification: `mutation CreateNotification($createNotificationInput: CreateNotificationInput!) {
    createNotification(createNotificationInput: $createNotificationInput) {
      id
      type
      authorId
      recipientId
      postId
      commentId
      createdAt
      seen
    }
  }`,
  destroyNotification: `mutation CreateNotification($destroyNotificationInput: CreateNotificationInput!) {
    destroyNotification(destroyNotificationInput: $destroyNotificationInput) {
     __typename
    }
  }`,
  findAllNotifications: `query FindAllNotifications($graphQlPageQuery: GraphQLPageQuery!) {
    findAllNotifications(graphQLPageQuery: $graphQlPageQuery) {
      id
      type
      authorId
      recipientId
      postId
      author {
        username
        profilePicture
      }
      post {
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
      }
      comment {
        id
        content
      }
      commentId
      storyId
      reelId
      createdAt
      seen
    }
  }`,
  unseenNotifications: `query Query {
    unseenNotifications {
      unreadCommentCount
      unreadPostCount
      unreadChatCount
    }
  }`,
  UnseenMessageNotifications: `query UnseenMessageNotifications {
    unseenMessageNotifications
  }`
}

export const NQ = Object.freeze(QueryN)