import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <h2>Dashboard</h2>
      
      <div class="overview-stats">
        <div class="stat-card">
          <div class="stat-icon tables-icon">🪑</div>
          <div class="stat-content">
            <div class="stat-title">Mesas</div>
            <div class="stat-value">
              <span class="big-value">{{tableStats.occupied}}</span>
              <span class="divider">/</span>
              <span class="total-value">{{tableStats.total}}</span>
            </div>
            <div class="stat-label">Ocupadas</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon orders-icon">🧾</div>
          <div class="stat-content">
            <div class="stat-title">Órdenes</div>
            <div class="stat-value">
              <span class="big-value">{{orderStats.active}}</span>
            </div>
            <div class="stat-label">Activas</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon sales-icon">💰</div>
          <div class="stat-content">
            <div class="stat-title">Ventas</div>
            <div class="stat-value">
              <span class="big-value">\${{salesStats.todaySales}}</span>
            </div>
            <div class="stat-label">Hoy</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon menu-icon">🍽️</div>
          <div class="stat-content">
            <div class="stat-title">Productos</div>
            <div class="stat-value">
              <span class="big-value">{{menuStats.total}}</span>
            </div>
            <div class="stat-label">Disponibles</div>
          </div>
        </div>
      </div>
      
      <div class="quick-actions">
        <h3>Acciones Rápidas</h3>
        <div class="actions-container">
          <a [routerLink]="['/tables']" class="action-card">
            <div class="action-icon">🪑</div>
            <div class="action-title">Ver Mesas</div>
          </a>
          
          <a [routerLink]="['/orders/create']" class="action-card">
            <div class="action-icon">➕</div>
            <div class="action-title">Nueva Orden</div>
          </a>
          
          <a [routerLink]="['/menu']" class="action-card">
            <div class="action-icon">🍔</div>
            <div class="action-title">Ver Menú</div>
          </a>
          
          <a [routerLink]="['/reports']" class="action-card">
            <div class="action-icon">📊</div>
            <div class="action-title">Reportes</div>
          </a>
        </div>
      </div>
      
      <div class="dashboard-sections">
        <div class="section recent-orders">
          <div class="section-header">
            <h3>Órdenes Recientes</h3>
            <a [routerLink]="['/orders']" class="view-all">Ver todas</a>
          </div>
          
          <div class="order-list">
            <div class="order-item" *ngFor="let order of recentOrders">
              <div class="order-info">
                <div class="order-id">#{{order.id}}</div>
                <div class="order-table">Mesa {{order.tableNumber}}</div>
              </div>
              <div class="order-details">
                <div class="order-server">{{order.server}}</div>
                <div class="order-time">{{order.time}}</div>
              </div>
              <div [class]="'order-status ' + order.statusClass">
                {{order.status}}
              </div>
              <div class="order-total">
                \${{order.total.toFixed(2)}}
              </div>
              <a [routerLink]="['/orders', order.id]" class="view-order-btn">Ver</a>
            </div>
            
            <div class="no-orders" *ngIf="recentOrders.length === 0">
              No hay órdenes recientes
            </div>
          </div>
        </div>
        
        <div class="section table-status">
          <div class="section-header">
            <h3>Estado de Mesas</h3>
            <a [routerLink]="['/tables']" class="view-all">Ver todas</a>
          </div>
          
          <div class="tables-grid">
            <div class="table-cell" *ngFor="let table of tables" 
                 [class.occupied]="table.status === 'Ocupada'"
                 [class.available]="table.status === 'Libre'">
              <div class="table-number">{{table.number}}</div>
              <div class="table-status-indicator">{{table.status}}</div>
              <div class="table-guests" *ngIf="table.status === 'Ocupada'">
                {{table.guests}} personas
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
    }
    
    h2 {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 20px;
      color: #2c3e50;
    }
    
    h3 {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 15px;
      color: #2c3e50;
    }
    
    .overview-stats {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    
    .stat-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 15px;
    }
    
    .stat-icon {
      font-size: 24px;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    
    .tables-icon {
      background-color: #3498db;
    }
    
    .orders-icon {
      background-color: #e74c3c;
    }
    
    .sales-icon {
      background-color: #2ecc71;
    }
    
    .menu-icon {
      background-color: #f39c12;
    }
    
    .stat-content {
      flex: 1;
    }
    
    .stat-title {
      font-size: 14px;
      color: #7f8c8d;
      margin-bottom: 5px;
    }
    
    .stat-value {
      display: flex;
      align-items: baseline;
      margin-bottom: 5px;
    }
    
    .big-value {
      font-size: 24px;
      font-weight: 700;
      color: #2c3e50;
    }
    
    .divider {
      margin: 0 5px;
      color: #95a5a6;
    }
    
    .total-value {
      font-size: 18px;
      color: #7f8c8d;
    }
    
    .stat-label {
      font-size: 12px;
      color: #7f8c8d;
    }
    
    .quick-actions {
      margin-bottom: 30px;
    }
    
    .actions-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 15px;
    }
    
    .action-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 15px;
      text-decoration: none;
      transition: all 0.3s;
    }
    
    .action-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    .action-icon {
      font-size: 28px;
    }
    
    .action-title {
      font-size: 14px;
      font-weight: 500;
      color: #2c3e50;
    }
    
    .dashboard-sections {
      display: grid;
      grid-template-columns: 1fr;
      gap: 20px;
    }
    
    @media (min-width: 1024px) {
      .dashboard-sections {
        grid-template-columns: 3fr 2fr;
      }
    }
    
    .section {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      padding: 20px;
    }
    
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }
    
    .section-header h3 {
      margin: 0;
    }
    
    .view-all {
      text-decoration: none;
      color: #3498db;
      font-size: 14px;
      font-weight: 500;
    }
    
    .order-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    
    .order-item {
      display: flex;
      align-items: center;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 6px;
      gap: 15px;
    }
    
    .order-info {
      flex: 1;
    }
    
    .order-id {
      font-weight: 600;
      font-size: 16px;
      color: #2c3e50;
    }
    
    .order-table {
      font-size: 14px;
      color: #7f8c8d;
    }
    
    .order-details {
      flex: 1;
    }
    
    .order-server {
      font-size: 14px;
      color: #2c3e50;
    }
    
    .order-time {
      font-size: 12px;
      color: #7f8c8d;
    }
    
    .order-status {
      font-size: 14px;
      font-weight: 500;
      padding: 6px 12px;
      border-radius: 20px;
    }
    
    .status-pending {
      background-color: #f39c12;
      color: white;
    }
    
    .status-in-progress {
      background-color: #3498db;
      color: white;
    }
    
    .status-ready {
      background-color: #2ecc71;
      color: white;
    }
    
    .status-completed {
      background-color: #7f8c8d;
      color: white;
    }
    
    .order-total {
      font-weight: 600;
      font-size: 16px;
      color: #2c3e50;
      min-width: 80px;
      text-align: right;
    }
    
    .view-order-btn {
      padding: 6px 12px;
      background-color: #3498db;
      color: white;
      border: none;
      border-radius: 4px;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
    }
    
    .no-orders {
      padding: 30px;
      text-align: center;
      font-style: italic;
      color: #7f8c8d;
    }
    
    .tables-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
      gap: 10px;
    }
    
    .table-cell {
      aspect-ratio: 1/1;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 10px;
    }
    
    .available {
      background-color: #eafaf1;
      border: 2px solid #2ecc71;
    }
    
    .occupied {
      background-color: #fef5e7;
      border: 2px solid #f39c12;
    }
    
    .table-number {
      font-size: 18px;
      font-weight: 700;
      color: #2c3e50;
    }
    
    .table-status-indicator {
      font-size: 12px;
      margin: 5px 0;
    }
    
    .table-guests {
      font-size: 12px;
      color: #7f8c8d;
    }
  `]
})
export class DashboardComponent implements OnInit {
  // Estadísticas de mesas
  tableStats = {
    total: 20,
    occupied: 8,
    available: 12
  };
  
  // Estadísticas de órdenes
  orderStats = {
    active: 5,
    completed: 12,
    cancelled: 1
  };
  
  // Estadísticas de ventas
  salesStats = {
    todaySales: 856.75,
    yesterdaySales: 723.50,
    growth: 18.42
  };
  
  // Estadísticas del menú
  menuStats = {
    total: 24,
    categories: 4
  };
  
  // Órdenes recientes
  recentOrders = [
    {
      id: 105,
      tableNumber: 7,
      server: 'Carlos Pérez',
      time: '14:30',
      status: 'En progreso',
      statusClass: 'status-in-progress',
      total: 52.75
    },
    {
      id: 104,
      tableNumber: 3,
      server: 'Ana García',
      time: '14:15',
      status: 'Pendiente',
      statusClass: 'status-pending',
      total: 78.50
    },
    {
      id: 103,
      tableNumber: 12,
      server: 'Luis Rodríguez',
      time: '13:50',
      status: 'Listo',
      statusClass: 'status-ready',
      total: 35.25
    },
    {
      id: 102,
      tableNumber: 5,
      server: 'María López',
      time: '13:20',
      status: 'Completado',
      statusClass: 'status-completed',
      total: 64.00
    }
  ];
  
  // Estado de mesas
  tables = [
    { number: 1, status: 'Ocupada', guests: 4 },
    { number: 2, status: 'Libre' },
    { number: 3, status: 'Ocupada', guests: 2 },
    { number: 4, status: 'Libre' },
    { number: 5, status: 'Ocupada', guests: 6 },
    { number: 6, status: 'Libre' },
    { number: 7, status: 'Ocupada', guests: 3 },
    { number: 8, status: 'Ocupada', guests: 2 },
    { number: 9, status: 'Libre' },
    { number: 10, status: 'Libre' },
    { number: 11, status: 'Libre' },
    { number: 12, status: 'Ocupada', guests: 4 }
  ];
  
  ngOnInit(): void {
    // En una aplicación real, aquí se cargarían los datos desde un servicio
    this.updateStats();
  }
  
  updateStats(): void {
    // Actualizar estadísticas basadas en los datos
    this.tableStats.occupied = this.tables.filter(t => t.status === 'Ocupada').length;
    this.tableStats.available = this.tableStats.total - this.tableStats.occupied;
    
    this.orderStats.active = this.recentOrders.filter(o => 
      o.status === 'Pendiente' || o.status === 'En progreso' || o.status === 'Listo'
    ).length;
  }
} 