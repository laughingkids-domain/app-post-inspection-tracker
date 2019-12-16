import React from "react";
import {
  Header as BaseHeader,
  Body,
  Title,
  Right,
  Left,
  Button,
  Icon,
  Text
} from "native-base";

export default function PostInspectionTrackerHeader() {
  return (
    <BaseHeader>
      <Left>
        <Button transparent>
          <Icon name="arrow-back" />
        </Button>
      </Left>
      <Body>
        <Title>Post Inspection Tracker</Title>
      </Body>
      <Right>
        <Button hasText transparent>
          <Text>Cancel</Text>
        </Button>
      </Right>
    </BaseHeader>
  );
}
