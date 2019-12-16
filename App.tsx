import React from "react";
import {
  Container,
  Header,
  Content,
  Left,
  Body,
  Right,
  Button,
  Title,
  Text
} from "native-base";
import SearchHomePage from "./src/Views/Search/Home/SearchHomePage";
import ShortlistHomePage from "./src/Views/Shortlist/Home/ShortlistHomePage";
import SavedHomePage from "./src/Views/Saved/Home/SavedHomePage";
import OwnersHomePage from "./src/Views/Owners/Home/OwnersHomePage";
import MoreHomepage from "./src/Views/More/Home/MoreHomePage";
import PostInspectionTracker from "./src/Views/Owners/PostInspectionTracker/PostInspectionTracker";

import { NativeRouter, Route } from "react-router-native";
import Footer from "./src/Components/Footer/Footer";

export default function App() {
  return (
    <NativeRouter>
      <Container>
        <Route exact path="/" component={SearchHomePage} />
        <Route path="/shortlist" component={ShortlistHomePage} />
        <Route path="/saved" component={SavedHomePage} />
        <Route path="/owners" component={OwnersHomePage} />
        <Route
          path="/owners/post-inspection-tracker"
          component={PostInspectionTracker}
        />
        <Route path="/more" component={MoreHomepage} />
        <Footer />
      </Container>
    </NativeRouter>
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
