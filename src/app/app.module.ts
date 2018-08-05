import { HttpService } from './services/http.service';
import { AppRoutingModule } from './app.routing';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { OrderhistoryComponent } from './orderhistory/orderhistory.component';
import { FiltersComponent } from './filters/filters.component';
import { PaginationComponent } from './pagination/pagination.component';
import { ApiService } from './services/api.service';


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
    HttpClientModule
  ],
  providers: [ApiService, HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
