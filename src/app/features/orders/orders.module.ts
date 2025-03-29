import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { OrderListComponent } from './order-list/order-list.component';
import { OrderCreateComponent } from './order-create/order-create.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';

const routes: Routes = [
  { path: '', component: OrderListComponent },
  { path: 'create', component: OrderCreateComponent },
  { path: ':id', component: OrderDetailComponent }
];

@NgModule({
  declarations: [
    OrderListComponent,
    OrderCreateComponent,
    OrderDetailComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class OrdersModule { } 