const listingDetailsQuery = (ids: string[]) => {
  const idInQuery = ids.join(",");
  const query = `query listingDetailsQuery {
    listings(ids: [${idInQuery}]) {
        id
        bathrooms
        carspaces
        bedrooms
        addressParts {
          displayAddress
        }
        inspectionDetails {
          inspections {
            openingDateTime
            closingDateTime
          }
        }
    }
  }`;
  return query;
};

export default listingDetailsQuery;
