import React from "react";
import { Container, Text } from "native-base";
import Header from "../../../Components/Header/Header";

export default function SavedHomePage() {
  return (
    <Container>
      <Header title={"Saved Listing"} />
      <Text>Saved</Text>
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
