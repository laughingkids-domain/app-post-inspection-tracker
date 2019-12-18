const userDetailsQuery = (id: number) => `
query userDetailsQuery {
  user(id: ${id}) {
    firstName
    lastName
    ownedProperties {
      id
      bathrooms
      carspaces
      bedrooms
      addressParts {
        displayAddress
        streetNumber
        street
        suburb
        postcode
        stateAbbreviation
      }
      media {
        url
        type
      }
      inspectionDetails {
        inspections {
         	openingDateTime
          closingDateTime
        }
      }
    }
  }
}`;

export default userDetailsQuery;
