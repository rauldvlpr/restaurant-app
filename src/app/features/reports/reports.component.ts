import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="reports-container">
      <div class="page-header">
        <h1>Reportes y Estadísticas</h1>
        <div class="header-actions">
          <button class="export-btn" (click)="exportReport()">Exportar Datos</button>
        </div>
      </div>
      
      <div class="date-filters">
        <div class="date-range">
          <label>Periodo:</label>
          <select [(ngModel)]="selectedPeriod" (change)="updateReports()">
            <option value="day">Hoy</option>
            <option value="week">Esta semana</option>
            <option value="month">Este mes</option>
            <option value="quarter">Último trimestre</option>
            <option value="year">Este año</option>
            <option value="custom">Personalizado</option>
          </select>
        </div>
        
        <div class="custom-date-range" *ngIf="selectedPeriod === 'custom'">
          <div class="date-input">
            <label>Desde:</label>
            <input type="date" [(ngModel)]="startDate" (change)="updateReports()">
          </div>
          <div class="date-input">
            <label>Hasta:</label>
            <input type="date" [(ngModel)]="endDate" (change)="updateReports()">
          </div>
        </div>
      </div>
      
      <div class="reports-grid">
        <!-- Tarjetas de resumen -->
        <div class="summary-cards">
          <div class="summary-card">
            <div class="card-icon sale-icon">
              <i class="icon">$</i>
            </div>
            <div class="card-data">
              <div class="card-value">\${{salesTotal.toFixed(2)}}</div>
              <div class="card-label">Ventas Totales</div>
              <div class="card-change" [class.positive]="salesChange > 0" [class.negative]="salesChange < 0">
                {{salesChange > 0 ? '+' : ''}}{{salesChange}}% vs. período anterior
              </div>
            </div>
          </div>
          
          <div class="summary-card">
            <div class="card-icon order-icon">
              <i class="icon">#</i>
            </div>
            <div class="card-data">
              <div class="card-value">{{ordersTotal}}</div>
              <div class="card-label">Órdenes Procesadas</div>
              <div class="card-change" [class.positive]="ordersChange > 0" [class.negative]="ordersChange < 0">
                {{ordersChange > 0 ? '+' : ''}}{{ordersChange}}% vs. período anterior
              </div>
            </div>
          </div>
          
          <div class="summary-card">
            <div class="card-icon average-icon">
              <i class="icon">~</i>
            </div>
            <div class="card-data">
              <div class="card-value">\${{averageTicket.toFixed(2)}}</div>
              <div class="card-label">Ticket Promedio</div>
              <div class="card-change" [class.positive]="ticketChange > 0" [class.negative]="ticketChange < 0">
                {{ticketChange > 0 ? '+' : ''}}{{ticketChange}}% vs. período anterior
              </div>
            </div>
          </div>
        </div>
        
        <!-- Gráficos -->
        <div class="chart-container sales-chart">
          <h2>Ventas por Día</h2>
          <div class="chart-placeholder">
            <div class="bar-chart">
              <div class="chart-bars">
                <div class="bar-container" *ngFor="let day of salesByDay">
                  <div class="bar" [style.height.%]="(day.amount / maxDailySales) * 100"></div>
                  <div class="bar-label">{{day.day}}</div>
                </div>
              </div>
              <div class="chart-axis">
                <div class="axis-label">\$0</div>
                <div class="axis-label">\${{(maxDailySales / 2).toFixed(0)}}</div>
                <div class="axis-label">\${{maxDailySales.toFixed(0)}}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="chart-container products-chart">
          <h2>Productos Más Vendidos</h2>
          <div class="chart-placeholder">
            <div class="horizontal-bars">
              <div class="h-bar-container" *ngFor="let product of topProducts">
                <div class="product-info">
                  <span class="product-name">{{product.name}}</span>
                  <span class="product-value">{{product.quantity}} unidades</span>
                </div>
                <div class="h-bar" [style.width.%]="(product.quantity / maxProductQuantity) * 100"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="chart-container categories-chart">
          <h2>Ventas por Categoría</h2>
          <div class="chart-placeholder">
            <div class="horizontal-bars">
              <div class="h-bar-container" *ngFor="let category of salesByCategory">
                <div class="product-info">
                  <span class="product-name">{{category.name}}</span>
                  <span class="product-value">\${{category.amount.toFixed(2)}}</span>
                </div>
                <div class="h-bar category-{{category.id}}" [style.width.%]="(category.amount / maxCategorySales) * 100"></div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Tabla de órdenes recientes -->
        <div class="recent-orders">
          <h2>Órdenes Recientes</h2>
          <table class="orders-table">
            <thead>
              <tr>
                <th>#Orden</th>
                <th>Fecha</th>
                <th>Mesa</th>
                <th>Items</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let order of recentOrders">
                <td>{{order.id}}</td>
                <td>{{order.date}}</td>
                <td>{{order.table}}</td>
                <td>{{order.items}}</td>
                <td>\${{order.total.toFixed(2)}}</td>
                <td><span class="status status-{{order.status.toLowerCase()}}">{{order.status}}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reports-container {
      padding: 20px;
    }
    
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    
    h1 {
      font-size: 24px;
      color: #2c3e50;
      margin: 0;
    }
    
    h2 {
      font-size: 18px;
      color: #2c3e50;
      margin: 0 0 15px 0;
    }
    
    .export-btn {
      background-color: #3498db;
      color: white;
      border: none;
      padding: 10px 15px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
    }
    
    .export-btn:hover {
      background-color: #2980b9;
    }
    
    .date-filters {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
      align-items: flex-end;
      background-color: white;
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
    
    .date-range {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    
    .custom-date-range {
      display: flex;
      gap: 15px;
    }
    
    .date-input {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    
    label {
      font-size: 14px;
      color: #7f8c8d;
    }
    
    select, input[type="date"] {
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }
    
    .reports-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }
    
    @media (max-width: 768px) {
      .reports-grid {
        grid-template-columns: 1fr;
      }
    }
    
    .summary-cards {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }
    
    .summary-card {
      background-color: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      display: flex;
      align-items: center;
      gap: 15px;
    }
    
    .card-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      color: white;
    }
    
    .sale-icon {
      background-color: #2ecc71;
    }
    
    .order-icon {
      background-color: #3498db;
    }
    
    .average-icon {
      background-color: #9b59b6;
    }
    
    .card-data {
      flex: 1;
    }
    
    .card-value {
      font-size: 24px;
      font-weight: bold;
      color: #2c3e50;
    }
    
    .card-label {
      font-size: 14px;
      color: #7f8c8d;
      margin-bottom: 5px;
    }
    
    .card-change {
      font-size: 12px;
    }
    
    .positive {
      color: #2ecc71;
    }
    
    .negative {
      color: #e74c3c;
    }
    
    .chart-container {
      background-color: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
    
    .sales-chart {
      grid-column: 1 / -1;
    }
    
    .chart-placeholder {
      height: 250px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .bar-chart {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    .chart-bars {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      height: 200px;
    }
    
    .bar-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
      padding: 0 10px;
    }
    
    .bar {
      width: 40px;
      background-color: #3498db;
      border-radius: 4px 4px 0 0;
      transition: height 0.3s;
    }
    
    .bar-label {
      margin-top: 5px;
      font-size: 12px;
      color: #7f8c8d;
    }
    
    .chart-axis {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding-right: 10px;
      height: 200px;
    }
    
    .axis-label {
      font-size: 12px;
      color: #7f8c8d;
    }
    
    .horizontal-bars {
      display: flex;
      flex-direction: column;
      gap: 15px;
      width: 100%;
    }
    
    .h-bar-container {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    
    .product-info {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
    }
    
    .product-name {
      color: #2c3e50;
    }
    
    .product-value {
      color: #7f8c8d;
      font-weight: 500;
    }
    
    .h-bar {
      height: 15px;
      background-color: #3498db;
      border-radius: 3px;
      transition: width 0.3s;
    }
    
    .category-1 { background-color: #e74c3c; } /* Entradas */
    .category-2 { background-color: #2ecc71; } /* Principales */
    .category-3 { background-color: #f39c12; } /* Postres */
    .category-4 { background-color: #9b59b6; } /* Bebidas */
    
    .recent-orders {
      grid-column: 1 / -1;
      background-color: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
    
    .orders-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .orders-table th, .orders-table td {
      padding: 12px 15px;
      text-align: left;
    }
    
    .orders-table th {
      background-color: #f8f9fa;
      color: #2c3e50;
      font-weight: 500;
      border-bottom: 1px solid #eee;
    }
    
    .orders-table tr:not(:last-child) td {
      border-bottom: 1px solid #eee;
    }
    
    .status {
      padding: 5px 10px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }
    
    .status-completada {
      background-color: #e6f7ee;
      color: #2ecc71;
    }
    
    .status-en_proceso {
      background-color: #eaf2fd;
      color: #3498db;
    }
    
    .status-pendiente {
      background-color: #fef3e9;
      color: #f39c12;
    }
    
    .status-cancelada {
      background-color: #fde9e9;
      color: #e74c3c;
    }
  `]
})
export class ReportsComponent implements OnInit {
  // Filtros de fecha
  selectedPeriod = 'month';
  startDate = '';
  endDate = '';
  
  // Datos de las tarjetas de resumen
  salesTotal = 0;
  salesChange = 0;
  ordersTotal = 0;
  ordersChange = 0;
  averageTicket = 0;
  ticketChange = 0;
  
  // Datos para los gráficos
  salesByDay: {day: string, amount: number}[] = [];
  maxDailySales = 0;
  
  topProducts: {id: number, name: string, quantity: number}[] = [];
  maxProductQuantity = 0;
  
  salesByCategory: {id: number, name: string, amount: number}[] = [];
  maxCategorySales = 0;
  
  // Órdenes recientes
  recentOrders: any[] = [];
  
  constructor() {}
  
  ngOnInit(): void {
    // Inicializar las fechas por defecto
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    
    this.startDate = this.formatDate(firstDay);
    this.endDate = this.formatDate(today);
    
    // Cargar los datos iniciales
    this.updateReports();
  }
  
  updateReports(): void {
    // En una aplicación real, aquí se cargarían los datos desde el servidor
    // Para este ejemplo, generamos datos de prueba
    this.generateMockData();
  }
  
  generateMockData(): void {
    // Generar datos para las tarjetas de resumen
    this.salesTotal = 15478.99;
    this.salesChange = 12.5;
    this.ordersTotal = 478;
    this.ordersChange = 8.7;
    this.averageTicket = 32.38;
    this.ticketChange = 3.4;
    
    // Generar datos para el gráfico de ventas por día
    this.salesByDay = [
      {day: 'Lun', amount: 2150.75},
      {day: 'Mar', amount: 1890.50},
      {day: 'Mié', amount: 2350.25},
      {day: 'Jue', amount: 2780.00},
      {day: 'Vie', amount: 3120.45},
      {day: 'Sáb', amount: 2580.30},
      {day: 'Dom', amount: 1980.15}
    ];
    this.maxDailySales = Math.max(...this.salesByDay.map(day => day.amount));
    
    // Generar datos para el gráfico de productos más vendidos
    this.topProducts = [
      {id: 1, name: 'Hamburguesa Clásica', quantity: 145},
      {id: 2, name: 'Pasta Alfredo', quantity: 98},
      {id: 3, name: 'Ensalada César', quantity: 76},
      {id: 4, name: 'Refresco', quantity: 210},
      {id: 5, name: 'Pastel de Chocolate', quantity: 65}
    ];
    this.maxProductQuantity = Math.max(...this.topProducts.map(product => product.quantity));
    
    // Generar datos para el gráfico de ventas por categoría
    this.salesByCategory = [
      {id: 1, name: 'Entradas', amount: 3245.50},
      {id: 2, name: 'Platos Principales', amount: 8654.75},
      {id: 3, name: 'Postres', amount: 1876.25},
      {id: 4, name: 'Bebidas', amount: 1702.49}
    ];
    this.maxCategorySales = Math.max(...this.salesByCategory.map(category => category.amount));
    
    // Generar datos para la tabla de órdenes recientes
    this.recentOrders = [
      {id: 1025, date: '2023-06-15 19:45', table: 'Mesa 8', items: 4, total: 56.75, status: 'Completada'},
      {id: 1024, date: '2023-06-15 19:30', table: 'Mesa 12', items: 3, total: 38.50, status: 'Completada'},
      {id: 1023, date: '2023-06-15 19:15', table: 'Mesa 5', items: 5, total: 72.25, status: 'En_proceso'},
      {id: 1022, date: '2023-06-15 19:00', table: 'Mesa 3', items: 2, total: 24.99, status: 'En_proceso'},
      {id: 1021, date: '2023-06-15 18:45', table: 'Mesa 7', items: 6, total: 89.45, status: 'Pendiente'},
      {id: 1020, date: '2023-06-15 18:30', table: 'Mesa 10', items: 3, total: 45.75, status: 'Cancelada'}
    ];
  }
  
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  exportReport(): void {
    console.log('Exportando reporte...');
    // En una aplicación real, aquí se generaría un archivo CSV o PDF
    // con los datos del reporte actual
    alert('Reporte exportado correctamente.');
  }
} 