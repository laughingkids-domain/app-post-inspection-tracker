import React from "react";
import {
  Footer as BaseFooter,
  FooterTab,
  Icon,
  Button,
  Text,
  Body
} from "native-base";
import { StyleSheet } from "react-native";
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
        <Button vertical active={isActiveFooterTab(location, "/search")}>
          <Link to={`/search`} underlayColor="transparent">
            <Body>
              <Icon name="search" />
              <Text style={[s.text]}>Search</Text>
            </Body>
          </Link>
        </Button>
        <Button vertical active={isActiveFooterTab(location, "/shortlist")}>
          <Link to={`/shortlist`} underlayColor="transparent">
            <Body>
              <Icon name="star" />
              <Text style={[s.text]}>Shortlist</Text>
            </Body>
          </Link>
        </Button>

        <Button vertical active={isActiveFooterTab(location, "/saved")}>
          <Link to={`/saved`} underlayColor="transparent">
            <Body>
              <Icon name="ios-cloud" />
              <Text style={[s.text]}>Saved</Text>
            </Body>
          </Link>
        </Button>
        <Button vertical active={isActiveFooterTab(location, "/")}>
          <Link to={`/`} underlayColor="transparent">
            <Body>
              <Icon active name="home" />
              <Text style={[s.text]}>Owners</Text>
            </Body>
          </Link>
        </Button>
        <Button vertical active={isActiveFooterTab(location, "/more")}>
          <Link to={`/more`} underlayColor="transparent">
            <Body>
              <Icon name="more" />
              <Text style={[s.text]}>More</Text>
            </Body>
          </Link>
        </Button>
      </FooterTab>
    </BaseFooter>
  );
}

const s = StyleSheet.create({
  text: {
    textAlign: "center",
    fontSize: 9
  }
});

export default withRouter(Footer);
