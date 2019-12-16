import React from "react";
import { Content, Text } from "native-base";

export interface IPropertyCardProps {
  underInspection: boolean;
}

export default function PropertyCard(props: IPropertyCardProps) {
  return (
    <Content>
      <Text>PropertyCard</Text>
    </Content>
  );
}
