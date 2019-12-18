import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { createHttpLink } from "apollo-link-http";
import { createPersistedQueryLink } from "apollo-link-persisted-queries";
import { onError } from "apollo-link-error";
import { InMemoryCache } from "apollo-cache-inmemory";

export function getApolloClient(uri: string, apiKey?: string) {
  const cache = new InMemoryCache();
  const link = ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.map(({ message, locations, path }) =>
          // eslint-disable-next-line no-console
          console.error(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        );
      }
      if (networkError) {
        // eslint-disable-next-line no-console
        console.error(`[GraphQL Network error]: ${networkError}`);
      }
    }),
    createPersistedQueryLink({ useGETForHashedQueries: true }).concat(
      createHttpLink({
        uri,
        headers: {
          "X-API-KEY": "da2-ciovdwvuvjbr7lrdqxwybvd3he" || apiKey
        }
      })
    )
  ]);
  return new ApolloClient({
    cache,
    link
  });
}
