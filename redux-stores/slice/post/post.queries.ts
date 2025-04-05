export const QPost = {
  findOnePost: `query findOnePostQuery($graphQlPageQuery: GraphQLPageQuery!) {
    findOnePost(graphQLPageQuery: $graphQlPageQuery) {
      id
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
  }
  `,
  // post like
  createAndDestroyLike: `mutation Like($input: CreateLikeInput!) {
    Like(input: $input)
  }`,
  // post comment
  createComment: `mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      id
      content
      authorId
      postId
      createdAt
      updatedAt
      user {
        username
        email
        id
        name
        profilePicture
      }
    }
  }`,
  findAllLikes: `query FindAllLikes($graphQlPageQuery: GraphQLPageQuery!) {
    findAllLikes(graphQLPageQuery: $graphQlPageQuery) {
      following
      followed_by
      id
      username
      email
      name
      profilePicture
    }
  }`,
  findAllComments: `query FindAllComments($graphQlPageQuery: GraphQLPageQuery!) {
    findAllComments(graphQLPageQuery: $graphQlPageQuery) {
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