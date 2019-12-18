const userDetailsQuery = (ids: string[]) => `
query listingDetailsQuery {
  listings(ids: ${ids}) {
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

export default userDetailsQuery;
