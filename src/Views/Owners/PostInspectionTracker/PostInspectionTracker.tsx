import React from "react";
import {
  Container,
  Header,
  Content,
  Footer,
  FooterTab,
  Icon,
  Left,
  Body,
  Right,
  Button,
  Title,
  Text
} from "native-base";

export default function App() {
  return (
    <Container>
      <Header>
        <Left>
          <Button transparent>
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body>
          <Title>Post Inspection</Title>
        </Body>
        <Right>
          <Button hasText transparent>
            <Text>Cancel</Text>
          </Button>
        </Right>
      </Header>
      <Content />
      <Footer>
        <FooterTab>
          <Button vertical>
            <Icon name="search" />
            <Text>Search</Text>
          </Button>
          <Button vertical>
            <Icon name="star" />
            <Text>Shortlist</Text>
          </Button>
          <Button vertical>
            <Icon name="camera" />
            <Text>Saved</Text>
          </Button>
          <Button vertical active>
            <Icon active name="home" />
            <Text>For owners</Text>
          </Button>
          <Button vertical>
            <Icon name="more" />
            <Text>More</Text>
          </Button>
        </FooterTab>
      </Footer>
    </Container>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center"
//   }
// });
