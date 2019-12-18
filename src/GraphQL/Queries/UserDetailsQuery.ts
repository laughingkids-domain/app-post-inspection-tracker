export const listDetailFragment = `
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
`;
const userDetailsQuery = (id: number) => `
query userDetailsQuery {
  user(id: ${id}) {
    firstName
    lastName
    ownedProperties {
      ${listDetailFragment}
    }
  }
}`;

export default userDetailsQuery;
