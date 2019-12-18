import React, { useState } from "react";
import { Container, List, ListItem, Text, Body } from "native-base";
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
      return today <= inspectionEnd && today >= inspectionStart;
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

const injectHeaderInListing = items => {
  if (items.findIndex(item => item.header) < 0) {
    const sortedOwnedProperties = items.sort(sortListingByUnderInspection);

    const unInspection = sortedOwnedProperties.findIndex(
      listing => !porpertyIsUnderInspection(listing)
    );

    sortedOwnedProperties.splice(unInspection, 0, {
      name: "Not Under Insepction",
      header: true
    });

    sortedOwnedProperties.splice(0, 0, {
      name: "Under Insepction",
      header: true
    });
    return sortedOwnedProperties;
  }
  return items;
};

export default function OwnersHomepage(props: IOwnerHomeProps) {
  const [ownListingCount, setOwnListingCount] = useState(0);
  return (
    <Container>
      <Header
        title={"Owners"}
        subtitle={`Owned Properties (${ownListingCount})`}
      />
      <Query
        query={gql`
          ${userDetailsQuery(loginUserId)}
        `}
      >
        {({ loading, error, data }) => {
          if (loading || error) return null;
          const { ownedProperties } = data.user;
          setOwnListingCount(ownedProperties.length);
          const sortedOwnedProperties = injectHeaderInListing([
            ...ownedProperties
          ]);
          const stickyHeaderIndices = [0].concat(
            sortedOwnedProperties.findIndex(
              item => item.header && sortedOwnedProperties.indexOf(item) !== 0
            )
          );
          return (
            <List
              dataArray={sortedOwnedProperties}
              stickyHeaderIndices={stickyHeaderIndices}
              renderItem={(listingItem, index) => {
                const { item } = listingItem;
                const underInspection = porpertyIsUnderInspection(item);
                return (
                  <ListItem
                    key={item.header ? `header-${index}` : item.id}
                    itemDivider={item.header}
                  >
                    {item.header
                      ? renderPropertyListHeader(item.name)
                      : renderPropertyCardInList(item, underInspection)}
                  </ListItem>
                );
              }}
            />
          );
        }}
      </Query>
    </Container>
  );
}
