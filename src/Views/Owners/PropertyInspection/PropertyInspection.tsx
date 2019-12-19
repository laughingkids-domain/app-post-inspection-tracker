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
  areaAspects?: string[];
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
  const [reportMode, setReportMode] = React.useState(false);

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

  const getCurrentAspect = (id, aspects) => {
    const areaFeedbackCount = getAreaFeedbackCount(id);
    return aspects[areaFeedbackCount];
  };

  const getAreaFeedbackCount = id => feedback.filter(fb => fb.id === id).length;

  const setFeedbackCallBack = rating => {
    const { label: room, listing: home, id, areaAspects } = currentArea;
    const areaFeedbackCount = getAreaFeedbackCount(id);
    const aspect = areaAspects[areaFeedbackCount];
    if (aspect) {
      const newFeedback = {
        id,
        room,
        home,
        rating,
        aspect,
        createAt: new Date().toLocaleString()
      };
      if (areaFeedbackCount + 1 === areaAspects.length) {
        setReviewedAreas([...reviewedAreas, id]);
      }
      setFeedback([...feedback, newFeedback]);
    } else {
      setCurrentArea({} as Area);
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
                          <Button
                            onPress={() => checkinCallBack(item)}
                            disabled={
                              checkedIn.findIndex(
                                done => done === item.userId
                              ) >= 0
                            }
                          >
                            <Icon name="key" />
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
    while (index <= counting) {
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
    const bathroomAreas = getAreas(bathrooms, "Bathroom", id, "man");
    const bedroomAreas = getAreas(bedrooms, "Bedroom", id, "bed");
    const carspaceAreas = getAreas(carspaces, "Carspace", id, "car");
    const kitchenAreas = getAreas(1, "Kitchen", id, "flower");
    const livingRoomAreas = getAreas(1, "Livingroom", id, "tv");
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
              onPress={() =>
                setCurrentArea({
                  ...area,
                  areaAspects: ratingAspect[area.type.toLowerCase()]
                })
              }
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
    // mock up living room and kitchen
    return bathrooms + bedrooms + carspaces + 2 === reviewedAreas.length;
  };

  const renderRatingHead = () => {
    let currentAspect = getCurrentAspect(
      currentArea.id,
      currentArea.areaAspects
    );
    const rateHeader = currentAspect
      ? `Rate for ${currentAspect}`
      : "Please select a room to contiue";
    return (
      <>
        <Text>{rateHeader}</Text>
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
          isDisabled={rateHeader.length === 0}
          defaultRating={5}
          onFinishRating={setFeedbackCallBack}
          size={20}
        />
      </>
    );
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

            return (
              listing && (
                <Container style={styles.content}>
                  {currentArea.id !== undefined &&
                    averageRating === 0 &&
                    renderRatingHead()}
                  {averageRating === 0 ? (
                    renderFloorPlan({ bathrooms, bedrooms, carspaces, id })
                  ) : (
                    <Content>
                      <Text style={styles.reportButton}>
                        Thanks for your feedback
                      </Text>
                      <Rating
                        type={"heart"}
                        ratingCount={10}
                        imageSize={10}
                        showRating
                        startingValue={averageRating}
                        readonly
                      />
                      <Button
                        style={styles.reportButton}
                        onPress={() => setReportMode(true)}
                      >
                        <Text>View Inspection Feedback</Text>
                      </Button>
                    </Content>
                  )}
                </Container>
              )
            );
          }}
        </Query>
      </Container>
    );
  };

  const renderReportMode = () => {
    return (
      <Container>
        <Header title={`Inspection Report`} subtitle={address} />
        <Text>TBC...</Text>
      </Container>
    );
  };

  let renderMode = renderInspectionMode;
  if (checkinMode) {
    renderMode = renderCheckinMode;
  }
  if (reportMode) {
    renderMode = renderReportMode;
  }
  return renderMode();
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
  },
  reportButton: {
    marginTop: 30,
    textAlign: "center"
  }
});
