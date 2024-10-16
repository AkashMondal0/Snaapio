const conversationQueries = {
  findAllConversation: `query FindAllConversation($graphQlPageQuery: GraphQLPageQuery!) {
    findAllConversation(GraphQLPageQuery: $graphQlPageQuery) {
      id
      members
      authorId
      user {
        id
        username
        email
        name
        profilePicture
      }
      isGroup
      lastMessageContent
      totalUnreadMessagesCount
      lastMessageCreatedAt
      createdAt
      updatedAt
      groupName
      groupImage
      groupDescription
      messages {
        content
        authorId
        conversationId
        createdAt
      }
    }
  }`,
  findOneConversation: `query FindOneConversation($graphQlPageQuery: GraphQLPageQuery!) {
    findOneConversation(GraphQLPageQuery: $graphQlPageQuery) {
      id
      members
      authorId
      messages {
        id
        conversationId
        authorId
        content
        fileUrl {
      id
      urls {
        low
        high
      }
      type
      caption
    }
        deleted
        seenBy
        createdAt
        updatedAt
      }
      user {
        id
        username
        email
        profilePicture
        name
      }
      isGroup
      updatedAt
      groupName
      groupImage
      groupDescription
      createdAt
      lastMessageContent
    }
  }`,
  findAllMessages: `query FindAllMessages($graphQlPageQuery: GraphQLPageQuery!) {
    findAllMessages(graphQLPageQuery: $graphQlPageQuery) {
      id
      conversationId
      authorId
      content
      user {
        username
        email
        name
        profilePicture
      }
      fileUrl {
      id
      urls {
        low
        high
      }
      type
      caption
    }
      deleted
      seenBy
      createdAt
      updatedAt
      members
    }
  }
  `,
  createConversation: `mutation CreateConversation($createConversationInput: CreateConversationInput!) {
    createConversation(createConversationInput: $createConversationInput) {
      id
    }
  }`,
  createMessage: `mutation CreateMessage($createMessageInput: CreateMessageInput!) {
    createMessage(createMessageInput: $createMessageInput) {
      id
      conversationId
      authorId
      content
      fileUrl {
      id
      urls {
        low
        high
      }
      type
      caption
    }
      deleted
      seenBy
      createdAt
      updatedAt
    }
  }`,
  seenMessages: `mutation SeenMessages($conversationId: String!) {
    seenMessages(conversationId: $conversationId) {
      __typename
    }
  }
  `
}

export const CQ = Object.freeze(conversationQueries)