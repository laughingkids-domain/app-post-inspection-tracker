const usersQuery = (ids?: number[]) => {
  const idInQuery = ids.join(",");
  return `
    query usersQuery {
      users(ids: [${idInQuery}]) {
          userId
          firstName
          lastName
          ageGroup
          avatarUrl
          location
      }
    }`;
};

export default usersQuery;
