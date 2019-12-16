import React from "react";
import { Container } from "native-base";
import SearchHomePage from "./src/Views/Search/Home/SearchHomePage";
import ShortlistHomePage from "./src/Views/Shortlist/Home/ShortlistHomePage";
import SavedHomePage from "./src/Views/Saved/Home/SavedHomePage";
import OwnersHomePage from "./src/Views/Owners/Home/OwnersHomePage";
import InspectionMode from "./src/Views/Owners/InspectionMode/InspectionMode";
import MoreHomePage from "./src/Views/More/Home/MoreHomePage";

import { NativeRouter, Route } from "react-router-native";
import Footer from "./src/Components/Footer/Footer";

export default function App() {
  return (
    <NativeRouter>
      <Container>
        <Route exact path="/" component={SearchHomePage} />
        <Route exact path="/shortlist" component={ShortlistHomePage} />
        <Route exact path="/saved" component={SavedHomePage} />
        <Route exact path="/owners" component={OwnersHomePage} />
        <Route
          exact
          path="/owners/inspection/:listingId"
          component={InspectionMode}
        />
        <Route exact path="/more" component={MoreHomePage} />
        <Footer />
      </Container>
    </NativeRouter>
  );
}
