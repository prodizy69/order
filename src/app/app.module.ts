import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MomentModule } from 'angular2-moment/moment.module';

import { AppRoutingModule } from './app.routing';

import { AppComponent } from './app.component';
import { OrderhistoryComponent } from './orderhistory/orderhistory.component';
import { FiltersComponent } from './filters/filters.component';
import { PaginationComponent } from './pagination/pagination.component';

import { ApiService } from './services/api.service';
import { HttpService } from './services/http.service';
import { UtilityService } from './services/utility.service';

@NgModule({
  declarations: [
    AppComponent,
    OrderhistoryComponent,
    FiltersComponent,
    PaginationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    MomentModule
  ],
  providers: [ApiService, HttpService, UtilityService],
  bootstrap: [AppComponent]
})
export class AppModule { }
