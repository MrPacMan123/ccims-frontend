import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ProjectListComponent } from './project-list-component/project-list.component';
import { ProjectOverviewComponent } from './project-overview/project-overview.component';
import { TopToolbarComponent } from './top-toolbar/top-toolbar.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { ComponentListComponent } from './component-list/component-list.component';
import { IssueDetailComponent } from './issue-detail/issue-detail.component';

import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';


@NgModule({
  declarations: [
    AppComponent,
    ProjectListComponent,
    ProjectOverviewComponent,
    TopToolbarComponent,
    SideNavComponent,
    ComponentListComponent,
    IssueDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    GraphQLModule,
    HttpClientModule,
    StoreModule.forRoot(reducers, {
      metaReducers
  }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
