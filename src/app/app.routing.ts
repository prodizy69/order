import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderhistoryComponent } from './orderhistory/orderhistory.component';

const routes: Routes = [{
  path: '', component: OrderhistoryComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
