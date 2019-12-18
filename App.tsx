import React from "react";
import { Container } from "native-base";
import SearchHomePage from "./src/Views/Search/Home/SearchHomePage";
import ShortlistHomePage from "./src/Views/Shortlist/Home/ShortlistHomePage";
import SavedHomePage from "./src/Views/Saved/Home/SavedHomePage";
import OwnersHomePage from "./src/Views/Owners/Home/OwnersHomePage";
import PropertyInspection from "./src/Views/Owners/PropertyInspection/PropertyInspection";
import PropertyOwnerView from "./src/Views/Owners/PropertyOwnerView/PropertyOwnerView";
import MoreHomePage from "./src/Views/More/Home/MoreHomePage";

import { NativeRouter, Route } from "react-router-native";
import Footer from "./src/Components/Footer/Footer";
import { ApolloProvider } from "@apollo/react-hooks";
import { getApolloClient } from "./src/GraphQL/ApolloClient";

// Create the client as outlined in the setup guide
const client = getApolloClient(`http://10.217.137.34:4000/`);

export default function App() {
  return (
    <ApolloProvider client={client}>
      <NativeRouter>
        <Container>
          <Route exact path="/" component={SearchHomePage} />
          <Route exact path="/shortlist" component={ShortlistHomePage} />
          <Route exact path="/saved" component={SavedHomePage} />
          <Route exact path="/owners" component={OwnersHomePage} />
          <Route
            exact
            path="/owners/property/inspection/:listingId"
            component={PropertyInspection}
          />
          <Route
            exact
            path="/owners/property/ownerview/:listingId"
            component={PropertyOwnerView}
          />
          <Route exact path="/more" component={MoreHomePage} />
          <Footer />
        </Container>
      </NativeRouter>
    </ApolloProvider>
  );
}
