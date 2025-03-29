import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(c => c.LoginComponent) 
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard/dashboard.component').then(c => c.DashboardComponent)
  },
  {
    path: 'tables',
    loadComponent: () => import('./features/tables/table-list/table-list.component').then(c => c.TableListComponent)
  },
  {
    path: 'menu',
    loadComponent: () => import('./features/menu/menu-list/menu-list.component').then(c => c.MenuListComponent)
  },
  {
    path: 'reports',
    loadComponent: () => import('./features/reports/reports.component').then(c => c.ReportsComponent)
  },
  {
    path: 'orders',
    children: [
      { 
        path: '', 
        loadComponent: () => import('./features/orders/order-list/order-list.component').then(c => c.OrderListComponent) 
      },
      { 
        path: 'create', 
        loadComponent: () => import('./features/orders/order-create/order-create.component').then(c => c.OrderCreateComponent) 
      },
      { 
        path: ':id', 
        loadComponent: () => import('./features/orders/order-detail/order-detail.component').then(c => c.OrderDetailComponent) 
      },
      { 
        path: ':id/edit', 
        loadComponent: () => import('./features/orders/order-edit/order-edit.component').then(c => c.OrderEditComponent) 
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
]; 