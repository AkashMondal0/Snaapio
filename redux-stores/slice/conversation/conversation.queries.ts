const conversationQueries = {
  findAllConversation: `query FindAllConversation($graphQlPageQuery: GraphQLPageQuery!) {
    findAllConversation(graphQLPageQuery: $graphQlPageQuery) {  
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
      membersPublicKey
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
    findOneConversation(graphQLPageQuery: $graphQlPageQuery) {  
      id
      members
      membersPublicKey
      authorId
      messages {
        id
        conversationId
        authorId
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
      deleted
      seenBy
      createdAt
      updatedAt
    }
  }`,
  seenMessages: `mutation SeenMessages($createMessageInputSeen: CreateMessageInputSeen!) {
    seenMessages(createMessageInputSeen: $createMessageInputSeen) {
      __typename
    }
  }
  `,
  sendTypingStatus: `query Query($typingStatusInput: TypingStatusInput!) {
  typingStatus(typingStatusInput: $typingStatusInput)
}`
}

export const CQ = Object.freeze(conversationQueries)