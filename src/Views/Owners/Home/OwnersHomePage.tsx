import React from "react";
import { Container } from "native-base";
import Header from "../../../Components/Header/Header";
import PropertyCard from "../../../Components/PropertyCard/PropertyCard";

interface IOwnerHomeProps {
  listings: any[];
}

const mockListing = [
  {
    openHometime: "2020-01-01"
  }
];

export default function OwnersHomepage(props: IOwnerHomeProps) {
  const { listings } = props;
  return (
    <Container>
      <Header title={"Owners"} subtitle={"Preview Mode"} />
      {listings ||
        mockListing.map(listing => {
          const underInspection = listing.openHometime === "2020-01-01";
          return <PropertyCard underInspection={underInspection} />;
        })}
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
