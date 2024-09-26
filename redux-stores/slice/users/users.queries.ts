export const QUsers = {
  findUsersByKeyword: `query FindUsersByKeyword($keyword: String!) {
    findUsersByKeyword(keyword: $keyword) {
      username
      profilePicture
      name
      id
      email
    }
  }`
}