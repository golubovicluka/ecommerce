import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { ProductsService } from './features/products/products.service';
import { RouterModule } from '@angular/router';


// Apollo
// import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular'
import { HttpLink } from 'apollo-angular/http';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { InMemoryCache } from '@apollo/client/core';

// Feature modules
import { ProductsModule } from './features/products/products.module';
import { HeaderComponent } from './features/main-layout/header/header.component';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    RouterModule,
    CommonModule,
    ProductsModule,
    HttpClientModule,
    ApolloModule
  ],
  exports: [
  ],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory(httpLink: HttpLink) {
        return {
          cache: new InMemoryCache(),
          link: httpLink.create({
            uri: 'https://webshop.hasura.app/v1/graphql',
            headers: new HttpHeaders({
              "x-hasura-admin-secret": "6sftAV4UtDQ6V26v1p4U4mDAS8eXiDDnBo62JFsQbdTjksQQjcF54reBmrA2p7Jl"
            }),
          }),
        };
      },
      deps: [HttpLink],
    },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
