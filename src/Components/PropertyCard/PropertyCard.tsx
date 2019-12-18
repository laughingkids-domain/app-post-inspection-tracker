import React from "react";
import { Text, Content } from "native-base";

interface Address {
  stateAbbreviation: String;
  displayType: String;
  streetNumber: String;
  street: String;
  suburb: String;
  postcode: String;
  displayAddress: String;
}
export interface IListingDetail {
  id: string;
  bathrooms: number;
  bedrooms: number;
  carspaces: number;
  addressParts: Address;
  attendUserIds?: number[];
}
export interface PropertyCardExtend {
  underInspection: boolean;
}

export interface IPropertyCardProps {
  listing: IListingDetail & PropertyCardExtend;
}

export default function PropertyCard(props: IPropertyCardProps) {
  const { bathrooms, underInspection, addressParts } = props.listing;
  return (
    <Content>
      <Text>{addressParts.displayAddress}</Text>
      <Text>{bathrooms}</Text>
    </Content>
  );
}
