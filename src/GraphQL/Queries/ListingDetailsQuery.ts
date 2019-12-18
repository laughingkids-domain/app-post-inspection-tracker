import { listDetailFragment } from "./UserDetailsQuery";

const listingDetailsQuery = (ids: string[]) => {
  const idInQuery = ids.join(",");
  const query = `query listingDetailsQuery {
    listings(ids: [${idInQuery}]) {
        ${listDetailFragment}
    }
  }`;
  return query;
};

export default listingDetailsQuery;
