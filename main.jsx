import { ApolloClient, InMemoryCache, ApolloProvider, split, HttpLink } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const httpLink = new HttpLink({
  uri: 'http://localhost:8021/graphql'
});
const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://localhost:8021/subscriptions'
}))
const splitLink = split(
  ({query}) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind == 'OperationDefinition' &&
      definition.operation == 'subscription'
    );
  },
  wsLink,
  httpLink,
);
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache()
});
  
ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
)
