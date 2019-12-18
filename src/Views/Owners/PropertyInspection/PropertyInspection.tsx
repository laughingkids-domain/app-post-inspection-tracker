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
  Content,
  Badge
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
import { IListingDetail } from "../../../Components/PropertyCard/PropertyCard";
import { AirbnbRating, Rating } from "react-native-ratings";

export interface Area {
  id: string;
  type: string;
  listing: string;
  icon: string;
  label: string;
}

interface Feedback {
  id: string;
  aspect: string;
  room: string;
  rating: number;
  comment?: string;
  createAt?: string;
  home?: string;
}

const ratingCompleted = rating => {
  console.log("Rating is: " + rating);
};

const ratingAspect = {
  bedroom: ["Space", "Lighting", "Storage", "Cleaning"],
  bathroom: ["Space", "Entrance", "Sanitation"],
  kitchen: ["Gas", "Oven", "Cleaning"],
  livingroom: ["Space", "Entertainment"],
  carspace: ["Accessibility", "Position", "Storage"]
};

interface IPropertyInspectionProps extends RouteComponentProps {}

function PropertyInspection(props: IPropertyInspectionProps) {
  const [checkinMode, setCheckinMode] = React.useState(true);
  const [buyers, setBuyers] = React.useState([]);
  const [checkedIn, setCheckedIn] = React.useState([] as number[]);
  const [currentArea, setCurrentArea] = React.useState({} as Area);
  const [address, setAddress] = React.useState("");
  const [feedback, setFeedback] = React.useState([] as Feedback[]);
  const [reviewedAreas, setReviewedAreas] = React.useState([]);
  const [currentAspect, setCurrentAspect] = React.useState("");

  const setBuyersHandler = (): void => {
    const userIds = [2, 3, 4, 5, 6];
    const start = Math.floor(Math.random() * Math.floor(5));
    let end = 0;
    while (true) {
      end = Math.floor(Math.random() * Math.floor(5));
      if (end > start) {
        break;
      }
    }
    if (buyers.length === 0) {
      setBuyers(userIds.slice(start, end));
    }
  };

  const isReviewed = id => {
    return (
      reviewedAreas &&
      reviewedAreas.length !== 0 &&
      reviewedAreas.findIndex(area => area === id) >= 0
    );
  };

  const checkinCallBack = user => {
    setCheckedIn([...checkedIn, user.userId]);
  };

  const getCurrentAspect = (id, type) => {
    const areaFeedback = feedback.filter(fb => fb.id === id);
    const aspects = ratingAspect[type];
    if (
      areaFeedback.length === aspects.length &&
      reviewedAreas.findIndex(area => area === id) < 0
    ) {
      setReviewedAreas([...reviewedAreas, id]);
      return;
    }
    setCurrentAspect(aspects[areaFeedback.length]);
    return aspects[areaFeedback.length];
  };

  const setFeedbackCallBack = rating => {
    const { label: room, listing: home, id, type } = currentArea;
    const aspect = getCurrentAspect(id, type);
    const newFeedback = {
      id,
      room,
      home,
      rating,
      aspect,
      createAt: new Date().toLocaleString()
    };
    if (aspect) {
      setFeedback([...feedback, newFeedback]);
    } else {
      getCurrentAspect(id, type);
    }
  };

  const renderCheckinMode = () => {
    setBuyersHandler();
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

  const getAreas = (counting = 0, type, id, icon = "home"): Area[] => {
    const areas = [];
    let index = 1;
    while (index !== counting) {
      const roomId = `${id}-${type}-${index}`;
      areas.push({
        id: roomId,
        type,
        listing: id,
        icon,
        label: counting === 1 ? type : `${type} ${index}`
      });
      ++index;
    }
    return areas;
  };

  const renderFloorPlan = ({ bathrooms, bedrooms, carspaces, id }) => {
    const bathroomAreas = getAreas(bathrooms, "bathroom", id);
    const bedroomAreas = getAreas(bedrooms, "bedroom", id);
    const carspaceAreas = getAreas(carspaces, "carspace", id);
    const kitchenAreas = getAreas(1, "kitchen", id);
    const livingRoomAreas = getAreas(1, "livingroom", id);
    const renderAreas = areas => {
      if (typeof areas === "undefined" || areas.length === 0) {
        return null;
      }
      return areas.map(
        (area, index) =>
          !isReviewed(area.id) && (
            <Button
              style={styles.areaButton}
              key={area.id}
              onPress={() => setCurrentArea(area)}
              disabled={area.id === currentArea.id}
            >
              <Icon name={area.icon} />
              <Text>{area.label || `Area ${index}`}</Text>
            </Button>
          )
      );
    };
    return (
      <Content style={styles.floorPlan}>
        {renderAreas(bathroomAreas)}
        {renderAreas(bedroomAreas)}
        {renderAreas(carspaceAreas)}
        {renderAreas(kitchenAreas)}
        {renderAreas(livingRoomAreas)}
      </Content>
    );
  };
  const isAllReviewed = (bathrooms, bedrooms, carspaces) => {
    return bathrooms + bedrooms + carspaces === reviewedAreas.length + 3;
  };

  const renderInspectionMode = () => {
    const params: any = useParams();
    const { listingId } = params;
    return (
      <Container>
        <Header
          title={currentArea.label || `Start your journey`}
          subtitle={address}
        />
        <Query
          query={gql`
            ${listingDetailsQuery([`"${listingId}"`])}
          `}
        >
          {({ loading, error, data }) => {
            if (loading || error) return null;
            const listing = data.listings[0] as IListingDetail;
            const { bathrooms, bedrooms, carspaces, id } = listing;
            const averageRating = isAllReviewed(bathrooms, bedrooms, carspaces)
              ? 8.8
              : 0;
            setAddress(listing.addressParts.displayAddress);
            if (currentArea.id !== undefined) {
              setCurrentAspect(ratingAspect[currentArea.type][0]);
            }
            return (
              listing && (
                <Container style={styles.content}>
                  {currentArea.id !== undefined && averageRating === 0 && (
                    <>
                      <Text>Rate for {currentAspect}</Text>
                      <AirbnbRating
                        count={10}
                        reviews={[
                          "Terrible",
                          "Bad",
                          "Meh",
                          "OK",
                          "Good",
                          "Very Good",
                          "Wow",
                          "Amazing",
                          "Unbelievable",
                          "Jesus"
                        ]}
                        defaultRating={5}
                        onFinishRating={setFeedbackCallBack}
                        size={20}
                      />
                    </>
                  )}
                  {averageRating === 0 ? (
                    renderFloorPlan({ bathrooms, bedrooms, carspaces, id })
                  ) : (
                    <Rating
                      type={"heart"}
                      ratingCount={10}
                      imageSize={10}
                      showRating
                      startingValue={averageRating}
                      readonly
                    />
                  )}
                </Container>
              )
            );
          }}
        </Query>
      </Container>
    );
  };

  return checkinMode ? renderCheckinMode() : renderInspectionMode();
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
  },
  content: {
    padding: 15
  },
  floorPlan: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "gray",
    marginTop: 15,
    padding: 5
  },
  areaButton: {
    width: "100%",
    borderRadius: 10,
    marginVertical: 5
  }
});
