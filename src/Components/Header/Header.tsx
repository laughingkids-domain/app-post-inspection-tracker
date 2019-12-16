import React from "react";
import {
  Header as BaseHeader,
  Body,
  Title,
  Subtitle,
  Left,
  Right
} from "native-base";

export interface ICommonHeaderProps {
  title?: string;
  subtitle?: string;
  renderLeftContent?: any;
  renderRightContent?: any;
}

export default function Header(props: ICommonHeaderProps) {
  const { title, subtitle, renderLeftContent, renderRightContent } = props;
  const hasLeftRightContent = renderLeftContent || renderRightContent;
  return (
    <BaseHeader>
      {hasLeftRightContent && (
        <Left>{renderLeftContent && renderLeftContent()}</Left>
      )}
      <Body>
        <Title>{title || "Domain"}</Title>
        <Subtitle>{subtitle || ""}</Subtitle>
      </Body>
      {renderRightContent && (
        <Right>{renderRightContent && renderRightContent()}</Right>
      )}
    </BaseHeader>
  );
}
