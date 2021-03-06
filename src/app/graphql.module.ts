import {NgModule} from '@angular/core';
import {APOLLO_OPTIONS} from 'apollo-angular';
import {ApolloClientOptions, InMemoryCache} from '@apollo/client/core';
import {HttpLink} from 'apollo-angular/http';
import { setContext } from '@apollo/link-context';
import { environment } from '../environments/environment';
const uri = 'https://api.github.com/graphql'; // <-- add the URL of the GraphQL server here

export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = environment.GH_AUTH_TOKEN;
    // return the headers to the context so httpLink can read them
    return {
       headers: {
         ...headers,
         Authorization: token ? `Bearer ${token}` : ''
       }
    };
  });
  return {
    link: authLink.concat(httpLink.create({uri})),
    cache: new InMemoryCache(),
  };
}

@NgModule({
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
