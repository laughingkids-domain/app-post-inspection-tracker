import React from "react";
import {
  Container,
  List,
  ListItem,
  Left,
  Thumbnail,
  Body,
  Text,
  Right,
  Button,
  Icon,
  Content
} from "native-base";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Header from "../../../Components/Header/Header";
import listingDetailsQuery from "../../../GraphQL/Queries/ListingDetailsQuery";
import usersQuery from "../../../GraphQL/Queries/UsersQuery";
import {
  withRouter,
  RouteComponentProps,
  useParams
} from "react-router-native";
import { StyleSheet } from "react-native";

const getBuyers = () => {
  const userIds = [2, 3, 4, 5, 6];
  const start = Math.floor(Math.random() * Math.floor(5));
  let end = 0;
  while (true) {
    end = Math.floor(Math.random() * Math.floor(5));
    if (end > start) {
      break;
    }
  }
  return userIds.slice(start, end);
};

interface IPropertyInspectionProps extends RouteComponentProps {}

function PropertyInspection(props: IPropertyInspectionProps) {
  const [checkinMode, setCheckinMode] = React.useState(true);
  const [buyers, setBuyers] = React.useState(getBuyers());
  const [checkedIn, setCheckedIn] = React.useState([]);

  const checkinCallBack = user => {
    setCheckedIn([...checkedIn, user.userId]);
    const checkedInUser = buyers.findIndex(buyer => buyer === user.userId);
    const nextBuyer = [...buyers.splice(checkedInUser, 1)];
    setBuyers(nextBuyer);
  };

  const renderCheckinMode = () => {
    return (
      <Container>
        <Header
          title={`Buyers Checkin`}
          subtitle={`${checkedIn.length} buyers on board`}
        />
        <Query
          query={gql`
            ${usersQuery(buyers)}
          `}
        >
          {({ loading, error, data }) => {
            if (loading || error) return null;
            const { users } = data;
            if (users.findIndex(item => item.header) < 0) {
              users.unshift({
                header: true,
                label: "People on the list"
              });
            } else {
              if (checkedIn.length === users.length - 1) {
                users.pop();
              }
            }

            return (
              <Content>
                <List
                  dataArray={users}
                  renderRow={item =>
                    item.header ? (
                      <ListItem key={"header"} itemDivider>
                        <Text>{item.label}</Text>
                      </ListItem>
                    ) : (
                      <ListItem key={item.header ? 0 : 1} avatar>
                        <Left>
                          <Thumbnail source={{ uri: item.avatarUrl }} />
                        </Left>
                        <Body>
                          <Text style={styles.nameText}>
                            {item.firstName} {item.lastName}
                          </Text>
                          <Text note numberOfLines={1}>
                            Age: {item.ageGroup} Location: {item.location}
                          </Text>
                        </Body>
                        <Right>
                          <Button onPress={() => checkinCallBack(item)}>
                            <Icon active name="add" />
                          </Button>
                        </Right>
                      </ListItem>
                    )
                  }
                ></List>
              </Content>
            );
          }}
        </Query>
        {checkedIn.length > 0 && (
          <Button
            style={styles.startButton}
            full
            onPress={() => setCheckinMode(false)}
          >
            <Text>Start Inspection</Text>
          </Button>
        )}
      </Container>
    );
  };

  const renderInspectionMode = () => {
    const params: any = useParams();
    const { listingId } = params;
    return (
      <Query
        query={gql`
          ${listingDetailsQuery([`"${listingId}"`])}
        `}
      >
        {({ loading, error, data }) => {
          if (loading || error) return null;
          const { listing } = data;
          return (
            <Container>
              <Header
                title={`Doing Inspection`}
                subtitle={`${checkedIn.length} buyers on board`}
              />
            </Container>
          );
        }}
      </Query>
    );
  };

  return (
    <Container>
      {checkinMode ? renderCheckinMode() : renderInspectionMode()}
    </Container>
  );
}

export default withRouter(PropertyInspection);

const styles = StyleSheet.create({
  nameText: {
    flex: 1,
    paddingVertical: 5,
    alignItems: "center",
    justifyContent: "center"
  },
  startButton: {
    position: "absolute",
    width: "100%",
    bottom: 0
  }
});
