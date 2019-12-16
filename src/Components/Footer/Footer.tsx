import React from "react";
import {
  Footer as BaseFooter,
  FooterTab,
  Icon,
  Button,
  Text
} from "native-base";
import { Link, withRouter, RouteComponentProps } from "react-router-native";

interface IFooterProps extends RouteComponentProps {}

function isActiveFooterTab(location: any, targetPath: string): boolean {
  return location.pathname === targetPath;
}

export function Footer(props: IFooterProps) {
  const { location } = props;
  return (
    <BaseFooter>
      <FooterTab>
        <Button vertical active={isActiveFooterTab(location, "/")}>
          <Icon name="search" />
          <Link to={`/`} underlayColor="#f0f4f7">
            <Text>Search</Text>
          </Link>
        </Button>
        <Button vertical active={isActiveFooterTab(location, "/shortlist")}>
          <Icon name="star" />
          <Link to={`/shortlist`} underlayColor="#f0f4f7">
            <Text>Shortlist</Text>
          </Link>
        </Button>
        <Button vertical active={isActiveFooterTab(location, "/saved")}>
          <Icon name="ios-cloud" />
          <Link to={`/saved`} underlayColor="#f0f4f7">
            <Text>Saved</Text>
          </Link>
        </Button>
        <Button vertical active={isActiveFooterTab(location, "/owners")}>
          <Icon active name="home" />
          <Link to={`/owners`} underlayColor="red">
            <Text>Owners</Text>
          </Link>
        </Button>
        <Button vertical active={isActiveFooterTab(location, "/more")}>
          <Icon name="more" />
          <Link to={`/more`} underlayColor="#f0f4f7">
            <Text>More</Text>
          </Link>
        </Button>
      </FooterTab>
    </BaseFooter>
  );
}

export default withRouter(Footer);
