export const QPost = {
  findOnePost: `query findOnePostQuery($findOnePostId: String!) {
    findOnePost(id: $findOnePostId) {
      id
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
      createdAt
      updatedAt
      commentCount
      likeCount
      is_Liked
      comments {
        content
        createdAt
        id
        user {
          id
          email
          username
          name
          profilePicture
        }
      }
      user {
        id
        username
        name
        profilePicture
      }
    }
  }`,
  // post like
  createLike: `mutation CreateLike($createLikeId: String!) {
    createLike(id: $createLikeId) {
    __typename
    }
  }`,
  destroyLike: `mutation DestroyLike($destroyLikeId: String!) {
    destroyLike(id: $destroyLikeId) {
    __typename
    }
  }`,
  // post comment
  createComment: `mutation CreateComment($createCommentInput: CreateCommentInput!) {
    createComment(createCommentInput: $createCommentInput) {
      updatedAt
      postId
      id
      createdAt
      content
      authorId
    }
  }`,
  findAllLikes: `query FindAllLikes($findAllLikesInput: GraphQLPageQuery!) {
    findAllLikes(findAllLikesInput: $findAllLikesInput) {
      following
      followed_by
      id
      username
      email
      name
      profilePicture
    }
  }`,
  findAllComments: `query FindAllComments($createCommentInput: GraphQLPageQuery!) {
    findAllComments(createCommentInput: $createCommentInput) {
      id
      content
      authorId
      postId
      createdAt
      updatedAt
      user {
        username
        email
        name
        profilePicture
      }
    }
  }`
}