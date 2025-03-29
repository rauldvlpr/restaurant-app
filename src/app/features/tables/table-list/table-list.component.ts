import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-table-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="tables-container">
      <div class="tables-header">
        <h2>Mesas</h2>
        <div class="tables-actions">
          <input type="text" placeholder="Buscar mesa..." [(ngModel)]="searchTerm" (input)="filterTables()">
          <select [(ngModel)]="statusFilter" (change)="filterTables()">
            <option value="all">Todas</option>
            <option value="Libre">Libres</option>
            <option value="Ocupada">Ocupadas</option>
          </select>
        </div>
      </div>
      
      <div class="tables-layout">
        <div class="table-item" *ngFor="let table of filteredTables" [ngClass]="{'occupied': table.status === 'Ocupada'}">
          <div class="table-header">
            <span class="table-number">Mesa {{table.number}}</span>
            <span class="table-status">{{table.status}}</span>
          </div>
          <div class="table-info">
            <div *ngIf="table.status === 'Ocupada'">
              <div class="info-row">
                <span class="label">Mesero:</span>
                <span class="value">{{table.server}}</span>
              </div>
              <div class="info-row">
                <span class="label">Clientes:</span>
                <span class="value">{{table.guests}}</span>
              </div>
              <div class="info-row">
                <span class="label">Hora:</span>
                <span class="value">{{table.time}}</span>
              </div>
            </div>
            <div *ngIf="table.status === 'Libre'" class="empty-table-message">
              Mesa disponible
            </div>
          </div>
          <div class="table-actions">
            <button *ngIf="table.status === 'Libre'" class="btn primary" (click)="assignTable(table)">Asignar mesa</button>
            <button *ngIf="table.status === 'Ocupada'" class="btn secondary" [routerLink]="['/orders', table.orderId]">Ver orden</button>
            <button *ngIf="table.status === 'Ocupada'" class="btn danger" (click)="releaseTable(table)">Liberar mesa</button>
          </div>
        </div>
        
        <div class="no-tables" *ngIf="filteredTables.length === 0">
          No se encontraron mesas con los filtros seleccionados
        </div>
      </div>
      
      <!-- Modal de asignación de mesa -->
      <div class="modal" *ngIf="showAssignModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Asignar Mesa {{selectedTable?.number}}</h3>
            <button class="close-btn" (click)="cancelAssign()">&times;</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>Mesero</label>
              <select [(ngModel)]="newAssignment.server">
                <option value="">Seleccionar mesero</option>
                <option>Juan Pérez</option>
                <option>María López</option>
                <option>Carlos Martínez</option>
              </select>
            </div>
            <div class="form-group">
              <label>Número de clientes</label>
              <input type="number" [(ngModel)]="newAssignment.guests" min="1" max="12">
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn cancel" (click)="cancelAssign()">Cancelar</button>
            <button class="btn primary" (click)="confirmAssign()" [disabled]="!isAssignmentValid()">Asignar</button>
          </div>
        </div>
      </div>
      
      <!-- Overlay cuando el modal está abierto -->
      <div class="overlay" *ngIf="showAssignModal" (click)="cancelAssign()"></div>
    </div>
  `,
  styles: [`
    .tables-container {
      padding: 20px;
      position: relative;
    }
    
    .tables-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 25px;
    }
    
    h2 {
      font-size: 24px;
      font-weight: 600;
      margin: 0;
      color: #2c3e50;
    }
    
    .tables-actions {
      display: flex;
      gap: 10px;
    }
    
    .tables-actions input, .tables-actions select {
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }
    
    .tables-layout {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
    
    .table-item {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      overflow: hidden;
      transition: transform 0.3s;
    }
    
    .table-item:hover {
      transform: translateY(-5px);
    }
    
    .table-item.occupied {
      border-left: 4px solid #e74c3c;
    }
    
    .table-header {
      padding: 15px;
      background-color: #f8f9fa;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .table-number {
      font-weight: bold;
      font-size: 18px;
      color: #2c3e50;
    }
    
    .table-status {
      padding: 5px 10px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      background-color: #ecf0f1;
    }
    
    .occupied .table-status {
      background-color: #e74c3c;
      color: white;
    }
    
    .table-info {
      padding: 15px;
      min-height: 100px;
    }
    
    .info-row {
      display: flex;
      margin-bottom: 8px;
    }
    
    .label {
      color: #7f8c8d;
      font-weight: 500;
      width: 80px;
    }
    
    .value {
      color: #2c3e50;
      font-weight: 400;
    }
    
    .empty-table-message {
      color: #7f8c8d;
      font-style: italic;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .table-actions {
      padding: 15px;
      border-top: 1px solid #eee;
      display: flex;
      gap: 10px;
    }
    
    .btn {
      flex: 1;
      padding: 10px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s;
    }
    
    .btn.primary {
      background-color: #3498db;
      color: white;
    }
    
    .btn.primary:hover {
      background-color: #2980b9;
    }
    
    .btn.primary:disabled {
      background-color: #95a5a6;
      cursor: not-allowed;
    }
    
    .btn.secondary {
      background-color: #2c3e50;
      color: white;
    }
    
    .btn.secondary:hover {
      background-color: #1a2530;
    }
    
    .btn.danger {
      background-color: #e74c3c;
      color: white;
    }
    
    .btn.danger:hover {
      background-color: #c0392b;
    }
    
    .btn.cancel {
      background-color: #ecf0f1;
      color: #7f8c8d;
    }
    
    .no-tables {
      grid-column: 1 / -1;
      text-align: center;
      padding: 30px;
      background-color: white;
      border-radius: 8px;
      color: #7f8c8d;
      font-style: italic;
    }
    
    /* Modal Styles */
    .modal {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
      z-index: 1000;
      width: 400px;
      max-width: 90%;
    }
    
    .modal-header {
      padding: 15px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #eee;
    }
    
    .modal-header h3 {
      margin: 0;
      font-size: 18px;
      color: #2c3e50;
    }
    
    .close-btn {
      background: none;
      border: none;
      font-size: 24px;
      color: #7f8c8d;
      cursor: pointer;
    }
    
    .modal-body {
      padding: 20px;
    }
    
    .form-group {
      margin-bottom: 15px;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
      color: #2c3e50;
    }
    
    .form-group select, .form-group input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
    }
    
    .modal-footer {
      padding: 15px 20px;
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      border-top: 1px solid #eee;
    }
    
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 999;
    }
  `]
})
export class TableListComponent {
  tables = [
    { number: 1, status: 'Libre' },
    { number: 2, status: 'Ocupada', server: 'Juan Pérez', guests: 4, time: '12:30 PM', orderId: 1 },
    { number: 3, status: 'Ocupada', server: 'María López', guests: 2, time: '1:15 PM', orderId: 2 },
    { number: 4, status: 'Libre' },
    { number: 5, status: 'Libre' },
    { number: 6, status: 'Ocupada', server: 'Carlos Martínez', guests: 6, time: '2:00 PM', orderId: 3 },
    { number: 7, status: 'Libre' },
    { number: 8, status: 'Libre' }
  ];
  
  filteredTables = [...this.tables];
  searchTerm = '';
  statusFilter = 'all';
  
  showAssignModal = false;
  selectedTable: any = null;
  newAssignment = {
    server: '',
    guests: 1
  };
  
  constructor(private router: Router) {}
  
  filterTables() {
    this.filteredTables = this.tables.filter(table => {
      // Filtrar por número de mesa
      const matchesSearch = this.searchTerm === '' || 
        table.number.toString().includes(this.searchTerm);
      
      // Filtrar por estado
      const matchesStatus = this.statusFilter === 'all' || 
        table.status === this.statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }
  
  assignTable(table: any) {
    this.selectedTable = table;
    this.showAssignModal = true;
  }
  
  releaseTable(table: any) {
    if (confirm(`¿Estás seguro de liberar la Mesa ${table.number}?`)) {
      // Aquí podrías verificar si hay una cuenta pendiente
      
      // Liberar la mesa
      table.status = 'Libre';
      delete table.server;
      delete table.guests;
      delete table.time;
      delete table.orderId;
      
      console.log(`Mesa ${table.number} liberada`);
    }
  }
  
  cancelAssign() {
    this.showAssignModal = false;
    this.selectedTable = null;
    this.newAssignment = {
      server: '',
      guests: 1
    };
  }
  
  confirmAssign() {
    if (!this.isAssignmentValid()) return;
    
    // Aquí asignamos la mesa
    if (this.selectedTable) {
      this.selectedTable.status = 'Ocupada';
      this.selectedTable.server = this.newAssignment.server;
      this.selectedTable.guests = this.newAssignment.guests;
      this.selectedTable.time = this.getCurrentTime();
      this.selectedTable.orderId = Math.floor(Math.random() * 1000) + 100; // Simular un ID de orden
      
      console.log(`Mesa ${this.selectedTable.number} asignada a ${this.selectedTable.server}`);
      
      // Opcionalmente, navegar a la página de crear orden
      this.router.navigate(['/orders/create']);
    }
    
    // Cerrar el modal
    this.cancelAssign();
  }
  
  isAssignmentValid(): boolean {
    return this.newAssignment.server !== '' && 
           this.newAssignment.guests >= 1 && 
           this.newAssignment.guests <= 12;
  }
  
  getCurrentTime(): string {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
} 