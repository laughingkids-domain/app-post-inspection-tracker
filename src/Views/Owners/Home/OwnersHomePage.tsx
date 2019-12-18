import React from "react";
import {
  Container,
  List,
  ListItem,
  Text,
  Content,
  Left,
  Body,
  Right
} from "native-base";
// import { View, FlatList } from "react-native";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Header from "../../../Components/Header/Header";
import userDetailsQuery from "../../../GraphQL/Queries/UserDetailsQuery";
import PropertyCard from "../../../Components/PropertyCard/PropertyCard";
import { Link } from "react-router-native";

interface IOwnerHomeProps {
  userPropertyData: any;
}

const loginUserId = 1;

const porpertyIsUnderInspection = listing => {
  if (
    listing.header ||
    (!listing.inspectionDetails && !listing.inspectionDetails.inspections)
  ) {
    return false;
  }
  const nextInspection = listing.inspectionDetails.inspections.findIndex(
    inspection => {
      const today = new Date();
      const inspectionStart = new Date(inspection.openingDateTime);
      const inspectionEnd = new Date(inspection.closingDateTime);
      return today < inspectionEnd && today > inspectionStart;
    }
  );
  return nextInspection >= 0;
};

const sortListingByUnderInspection = (one, another) =>
  Number(porpertyIsUnderInspection(another)) -
  Number(porpertyIsUnderInspection(one));

const renderPropertyCardInList = (listing, underInspection) => (
  <Link
    to={
      underInspection
        ? `/owners/property/inspection/${listing.id}`
        : `/owners/property/ownerview/${listing.id}`
    }
  >
    <PropertyCard
      listing={{
        ...listing,
        underInspection
      }}
    />
  </Link>
);

const renderPropertyListHeader = name => (
  <Body style={{ marginRight: 40 }}>
    <Text style={{ fontWeight: "bold" }}>{name}</Text>
  </Body>
);

export default function OwnersHomepage(props: IOwnerHomeProps) {
  return (
    <Query
      query={gql`
        ${userDetailsQuery(loginUserId)}
      `}
    >
      {({ loading, error, data }) => {
        if (loading || error) return null;
        const { ownedProperties } = data.user;
        const sortedOwnedProperties = ownedProperties.sort(
          sortListingByUnderInspection
        );
        console.log(sortedOwnedProperties.length);

        const unInspection = sortedOwnedProperties.indexOf(
          sortedOwnedProperties.find(
            listing => !porpertyIsUnderInspection(listing)
          )
        );

        sortedOwnedProperties.splice(unInspection, 0, {
          name: "Not Under Insepction",
          header: true
        });

        sortedOwnedProperties.splice(0, 0, {
          name: "Under Insepction",
          header: true
        });

        console.log(unInspection, sortedOwnedProperties.length);

        return (
          <Container>
            <Header
              title={"Owners"}
              subtitle={`Owned Properties (${ownedProperties.length})`}
            />
            <Container>
              <List
                dataArray={ownedProperties}
                stickyHeaderIndices={[0, unInspection + 1]}
                renderItem={listingItem => {
                  const { item } = listingItem;
                  const underInspection = porpertyIsUnderInspection(item);
                  return (
                    <ListItem key={item.id} itemDivider={item.header}>
                      {item.header
                        ? renderPropertyListHeader(item.name)
                        : renderPropertyCardInList(item, underInspection)}
                    </ListItem>
                  );
                }}
              />
            </Container>
          </Container>
        );
      }}
    </Query>
  );
}
