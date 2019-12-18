import React from "react";
import { Container, List, ListItem } from "native-base";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Header from "../../../Components/Header/Header";
import listingDetailsQuery from "../../../GraphQL/Queries/ListingDetailsQuery";
import PropertyCard, {
  IListingDetail
} from "../../../Components/PropertyCard/PropertyCard";
import { AirbnbRating } from "react-native-ratings";
import { withRouter, useParams } from "react-router-native";

function PropertyOwnerView() {
  const params = useParams();
  const { listingId } = params;
  console.log(listingId);
  return (
    <Container>
      <Header title={"Owners"} subtitle={"View Property"} />
      <Query
        query={gql`
          ${listingDetailsQuery([`"${listingId}"`])}
        `}
      >
        {({ loading, error, data }) => {
          if (loading || error) return null;
          const listing = data.listings[0] as IListingDetail;
          const { averageRating } = listing;
          return (
            listing && (
              <Container>
                <List
                  dataArray={[listing]}
                  renderItem={listingItem => {
                    const { item } = listingItem;
                    return (
                      <ListItem key={item.id} thumbnail={!item.header}>
                        <PropertyCard
                          listing={{
                            ...listing,
                            averageRating: averageRating || 7.5
                          }}
                        />
                      </ListItem>
                    );
                  }}
                />
              </Container>
            )
          );
        }}
      </Query>
    </Container>
  );
}

export default withRouter(PropertyOwnerView);
