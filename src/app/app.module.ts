import { HttpService } from './services/http.service';
import { AppRoutingModule } from './app.routing';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { OrderhistoryComponent } from './orderhistory/orderhistory.component';
import { FiltersComponent } from './filters/filters.component';
import { PaginationComponent } from './pagination/pagination.component';
import { ApiService } from './services/api.service';
import { MomentModule } from 'angular2-moment/moment.module';

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
  providers: [ApiService, HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
