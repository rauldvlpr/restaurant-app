import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FooterComponent } from './components/footer/footer.component';

import { AuthService } from './services/auth.service';
import { OrderService } from './services/order.service';
import { CategoryService } from './services/category.service';
import { ProductService } from './services/product.service';
import { UserService } from './services/user.service';

import { mockBackendProvider } from './services/mock-backend.interceptor';

@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    HeaderComponent,
    SidebarComponent,
    FooterComponent
  ],
  exports: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent
  ],
  providers: [
    AuthService,
    OrderService,
    CategoryService,
    ProductService,
    UserService,
    mockBackendProvider
  ]
})
export class CoreModule { } 