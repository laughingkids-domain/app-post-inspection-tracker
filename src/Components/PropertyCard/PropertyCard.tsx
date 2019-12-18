import React from "react";
import { Text, Content, Left, Thumbnail, Body, Right } from "native-base";
import { AirbnbRating, Rating } from "react-native-ratings";

interface Address {
  stateAbbreviation: string;
  displayType: string;
  streetNumber: string;
  street: string;
  suburb: string;
  postcode: string;
  displayAddress: string;
}

export interface Inspection {
  closingDateTime: string;
  openingDateTime: string;
}

export interface IListingDetail {
  id: string;
  bathrooms?: number;
  bedrooms?: number;
  carspaces?: number;
  addressParts?: Address;
  attendUserIds?: number[];
  inspectionDetails?: {
    inspections?: Inspection[];
    pastInspections?: Inspection[];
  };
  averageRating?: number;
}
export interface PropertyCardExtend {
  underInspection?: boolean;
  media?: any[];
}

export interface IPropertyCardProps {
  listing: IListingDetail & PropertyCardExtend;
}

export default function PropertyCard(props: IPropertyCardProps) {
  const { listing } = props;
  const {
    bathrooms,
    bedrooms,
    carspaces,
    addressParts,
    averageRating
  } = listing;
  const nextInspection = listing.inspectionDetails.inspections.find(
    inspection => {
      const today = new Date("2019-12-28T01:10:00.000Z");
      const inspectionStart = new Date(inspection.openingDateTime);
      const inspectionEnd = new Date(inspection.closingDateTime);
      return today <= inspectionEnd && today >= inspectionStart;
    }
  );
  const finishAt = nextInspection && new Date(nextInspection.closingDateTime);
  const thumbnail = listing.media.filter(media => media.type === "photo");
  const {
    streetNumber,
    street,
    suburb,
    stateAbbreviation,
    postcode
  } = addressParts;
  return (
    <>
      <Left>
        {!averageRating && (
          <Thumbnail square large source={{ uri: thumbnail[0].url }} />
        )}
      </Left>
      <Body>
        <Text>
          {streetNumber} {street},
        </Text>
        <Text>
          {suburb} {postcode} {stateAbbreviation.toUpperCase()}
        </Text>
        {finishAt ? (
          <Text>Inspection will end at {finishAt.toLocaleTimeString()}</Text>
        ) : (
          <>
            <Text>{`bedrooms:${bedrooms}, bathrooms:${bathrooms}`}</Text>
            <Text>{`carspaces:${carspaces}`}</Text>
          </>
        )}
      </Body>
      <Right>
        {averageRating && (
          <Rating
            type={"heart"}
            ratingCount={10}
            imageSize={10}
            showRating
            startingValue={averageRating || 8.5}
            readonly
          />
        )}
      </Right>
    </>
  );
}
