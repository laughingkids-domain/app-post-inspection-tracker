import React, { useState } from "react";
import { Container, List, ListItem, Text, Body } from "native-base";
// import { View, FlatList } from "react-native";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Header from "../../../Components/Header/Header";
import userDetailsQuery from "../../../GraphQL/Queries/UserDetailsQuery";
import PropertyCard from "../../../Components/PropertyCard/PropertyCard";
import { Link, useHistory } from "react-router-native";

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
      const today = new Date("2019-12-19T03:10:00.000Z");
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

const renderPropertyCardInList = listing => (
  <PropertyCard
    listing={{
      ...listing
    }}
  />
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
  const [userName, setUserName] = useState("Owner");
  let history = useHistory();
  return (
    <Container>
      <Header
        title={userName}
        subtitle={`Owned Properties (${ownListingCount})`}
      />
      <Query
        query={gql`
          ${userDetailsQuery(loginUserId)}
        `}
      >
        {({ loading, error, data }) => {
          if (loading || error) return null;
          const { ownedProperties, firstName, lastName } = data.user;
          setOwnListingCount(ownedProperties.length);
          setUserName(`${firstName} ${lastName}`);
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
                const detailUrl = underInspection
                  ? `/owners/property/inspection/${item.id}`
                  : `/owners/property/ownerview/${item.id}`;
                return (
                  <ListItem
                    key={item.header ? `header-${index}` : item.id}
                    itemDivider={item.header}
                    onPress={() => history.push(detailUrl)}
                    thumbnail={!item.header}
                  >
                    {item.header
                      ? renderPropertyListHeader(item.name)
                      : renderPropertyCardInList(item)}
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
