import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-container">
      <header class="app-header">
        <div class="logo">
          <h1>RestaurantApp</h1>
        </div>
        <nav class="main-nav">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Inicio</a>
          <a routerLink="/tables" routerLinkActive="active">Mesas</a>
          <a routerLink="/orders" routerLinkActive="active">Órdenes</a>
          <a routerLink="/menu" routerLinkActive="active">Menú</a>
          <a routerLink="/reports" routerLinkActive="active">Reportes</a>
        </nav>
        <div class="user-menu">
          <button class="user-button">
            <span class="user-name">Admin</span>
          </button>
        </div>
      </header>
      
      <div class="main-content">
        <main class="content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .app-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      height: 60px;
      background-color: #ffffff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .logo h1 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: #3498db;
    }
    
    .main-nav {
      display: flex;
      gap: 20px;
    }
    
    .main-nav a {
      text-decoration: none;
      color: #333;
      font-weight: 500;
      padding: 5px 10px;
      border-radius: 4px;
      transition: all 0.3s;
    }
    
    .main-nav a:hover, 
    .main-nav a.active {
      color: #3498db;
      background-color: rgba(52, 152, 219, 0.1);
    }
    
    .user-button {
      background: none;
      border: none;
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      padding: 5px 10px;
      border-radius: 4px;
    }
    
    .user-button:hover {
      background-color: #f5f5f5;
    }
    
    .user-name {
      font-weight: 500;
    }
  `]
})
export class AppComponent {
  title = 'Restaurant App';
} 