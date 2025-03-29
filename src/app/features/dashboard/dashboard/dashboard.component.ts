import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <h1>Dashboard</h1>
      <div class="dashboard-content">
        <div class="dashboard-card">
          <h2>Comandas Activas</h2>
          <p class="card-value">2</p>
        </div>
        <div class="dashboard-card">
          <h2>Comandas del Día</h2>
          <p class="card-value">5</p>
        </div>
        <div class="dashboard-card">
          <h2>Ventas del Día</h2>
          <p class="card-value">$158.94</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
    }
    
    h1 {
      color: #2c3e50;
      margin-bottom: 20px;
    }
    
    .dashboard-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }
    
    .dashboard-card {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      padding: 20px;
      text-align: center;
    }
    
    .dashboard-card h2 {
      font-size: 18px;
      margin-bottom: 15px;
      color: #2c3e50;
    }
    
    .card-value {
      font-size: 32px;
      font-weight: bold;
      color: #27ae60;
      margin: 0;
    }
  `]
})
export class DashboardComponent {} 