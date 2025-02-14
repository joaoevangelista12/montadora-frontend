import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql', // URL do seu servidor GraphQL
  cache: new InMemoryCache()
});

export default client;