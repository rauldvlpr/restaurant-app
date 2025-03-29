import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryFormComponent } from './category-form/category-form.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductFormComponent } from './product-form/product-form.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserFormComponent } from './user-form/user-form.component';

const routes: Routes = [
  { path: 'categories', component: CategoryListComponent },
  { path: 'categories/create', component: CategoryFormComponent },
  { path: 'categories/:id', component: CategoryFormComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'products/create', component: ProductFormComponent },
  { path: 'products/:id', component: ProductFormComponent },
  { path: 'users', component: UserListComponent },
  { path: 'users/create', component: UserFormComponent },
  { path: 'users/:id', component: UserFormComponent },
  { path: '', redirectTo: 'categories', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    CategoryListComponent,
    CategoryFormComponent,
    ProductListComponent,
    ProductFormComponent,
    UserListComponent,
    UserFormComponent
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
export class CatalogModule { } 