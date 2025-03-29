import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  template: `
    <div class="order-detail-container">
      <div class="page-header">
        <h1>Detalle de Orden #{{order.id}}</h1>
        <div class="header-actions">
          <button class="back-btn" routerLink="/orders">Volver a la lista</button>
        </div>
      </div>
      
      <div class="order-card">
        <div class="order-status-bar">
          <div class="status-indicator">
            <span class="status-label">Estado:</span>
            <span class="status-badge" [ngClass]="getStatusClass()">{{order.status}}</span>
          </div>
          <div class="order-actions">
            <button class="action-btn generate-bill" (click)="generateBill()" [disabled]="!canGenerateBill()">
              Generar cuenta
            </button>
            <button class="action-btn update-status" (click)="updateStatus()" [disabled]="order.status === 'Completada' || order.status === 'Cancelada'">
              <span *ngIf="order.status === 'Pendiente'">Iniciar preparación</span>
              <span *ngIf="order.status === 'En preparación'">Marcar como listo</span>
              <span *ngIf="order.status === 'Listo'">Marcar como completado</span>
              <span *ngIf="order.status === 'Completada' || order.status === 'Cancelada'">No disponible</span>
            </button>
          </div>
        </div>
        
        <div class="order-details">
          <div class="details-column">
            <div class="detail-row">
              <span class="label">Mesa:</span>
              <span class="value">{{order.tableNumber}}</span>
            </div>
            <div class="detail-row">
              <span class="label">Mesero:</span>
              <span class="value">{{order.server}}</span>
            </div>
            <div class="detail-row">
              <span class="label">Fecha:</span>
              <span class="value">{{order.date | date:'dd/MM/yyyy HH:mm'}}</span>
            </div>
          </div>
          <div class="details-column">
            <div class="detail-row">
              <span class="label">Total:</span>
              <span class="value total">\${{calculateOrderTotal().toFixed(2)}}</span>
            </div>
          </div>
        </div>
        
        <div class="order-items">
          <h2>Productos en la orden</h2>
          
          <div class="items-table">
            <div class="table-header">
              <div class="col product-col">Producto</div>
              <div class="col quantity-col">Cantidad</div>
              <div class="col price-col">Precio Unitario</div>
              <div class="col total-col">Total</div>
              <div class="col actions-col">Acciones</div>
            </div>
            
            <div class="table-row" *ngFor="let item of order.items; let i = index">
              <div class="col product-col">
                <div class="product-name">{{item.name}}</div>
                <div class="product-notes" *ngIf="item.notes">{{item.notes}}</div>
              </div>
              <div class="col quantity-col">
                <div class="quantity-controls">
                  <button class="qty-btn" (click)="decreaseQuantity(item)" [disabled]="!canEditOrder()">-</button>
                  <span class="quantity">{{item.quantity}}</span>
                  <button class="qty-btn" (click)="increaseQuantity(item)" [disabled]="!canEditOrder()">+</button>
                </div>
              </div>
              <div class="col price-col">\${{item.price.toFixed(2)}}</div>
              <div class="col total-col">\${{(item.price * item.quantity).toFixed(2)}}</div>
              <div class="col actions-col">
                <button class="remove-btn" (click)="removeItem(i)" [disabled]="!canEditOrder()">Eliminar</button>
              </div>
            </div>

            <div class="no-items" *ngIf="order.items.length === 0">
              No hay productos en esta orden
            </div>
          </div>
          
          <div class="items-summary">
            <div class="summary-row">
              <span class="label">Subtotal:</span>
              <span class="value">\${{calculateOrderTotal().toFixed(2)}}</span>
            </div>
            <div class="summary-row">
              <span class="label">Total:</span>
              <span class="value grand-total">\${{calculateOrderTotal().toFixed(2)}}</span>
            </div>
          </div>
        </div>
        
        <div class="order-actions-bottom">
          <button class="action-btn add-product" [routerLink]="['/orders', order.id, 'edit']" [disabled]="!canEditOrder()">
            Agregar más productos
          </button>
          <button class="action-btn update-order" (click)="saveChanges()" [disabled]="!orderChanged || !canEditOrder()">
            Guardar cambios
          </button>
          <button class="action-btn cancel-order" (click)="cancelOrder()" *ngIf="order.status !== 'Cancelada' && order.status !== 'Completada'">
            Cancelar orden
          </button>
        </div>
      </div>

      <!-- Modal de confirmación para cancelar orden -->
      <div class="modal" *ngIf="showCancelModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Cancelar orden</h3>
            <button class="close-btn" (click)="showCancelModal = false">&times;</button>
          </div>
          <div class="modal-body">
            <p>¿Estás seguro de que deseas cancelar esta orden?</p>
            <p>Esta acción no se puede deshacer.</p>
          </div>
          <div class="modal-footer">
            <button class="btn" (click)="showCancelModal = false">No, mantener orden</button>
            <button class="danger-btn" (click)="confirmCancelOrder()">Sí, cancelar orden</button>
          </div>
        </div>
      </div>

      <!-- Modal de confirmación de cambios guardados -->
      <div class="modal" *ngIf="showSaveModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Cambios guardados</h3>
          </div>
          <div class="modal-body">
            <p>Los cambios en la orden han sido guardados correctamente.</p>
          </div>
          <div class="modal-footer">
            <button class="primary-btn" (click)="showSaveModal = false">Aceptar</button>
          </div>
        </div>
      </div>
      
      <!-- Modal de cuenta generada -->
      <div class="modal" *ngIf="showBillModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Cuenta Generada</h3>
            <button class="close-btn" (click)="showBillModal = false">&times;</button>
          </div>
          <div class="modal-body">
            <h4>Mesa {{order.tableNumber}} - Orden #{{order.id}}</h4>
            <p><strong>Mesero:</strong> {{order.server}}</p>
            <p><strong>Fecha:</strong> {{order.date | date:'dd/MM/yyyy HH:mm'}}</p>
            
            <div class="bill-items">
              <table class="bill-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let item of groupedItems">
                    <td>{{item.name}}</td>
                    <td>{{item.quantity}}</td>
                    <td>\${{item.price.toFixed(2)}}</td>
                    <td>\${{(item.price * item.quantity).toFixed(2)}}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="3" class="bill-total-label">Total</td>
                    <td class="bill-total-value">\${{billTotal.toFixed(2)}}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn" (click)="showBillModal = false">Cerrar</button>
            <button class="print-btn" (click)="printBill()">Imprimir</button>
          </div>
        </div>
      </div>
      
      <!-- Overlay cuando el modal está abierto -->
      <div class="overlay" *ngIf="showCancelModal || showSaveModal || showBillModal" (click)="closeModals()"></div>
    </div>
  `,
  styles: [`
    .order-detail-container {
      padding: 20px;
      position: relative;
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
    
    .back-btn {
      background-color: #ecf0f1;
      color: #2c3e50;
      border: none;
      padding: 8px 15px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s;
    }
    
    .back-btn:hover {
      background-color: #dde4e6;
    }
    
    .order-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    
    .order-status-bar {
      padding: 15px;
      background-color: #f8f9fa;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .status-indicator {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .status-label {
      font-weight: 500;
    }
    
    .status-badge {
      padding: 5px 10px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 500;
    }
    
    .status-badge.pending {
      background-color: #fdcb6e;
      color: #866118;
    }
    
    .status-badge.inProgress {
      background-color: #74b9ff;
      color: #0056b3;
    }
    
    .status-badge.ready {
      background-color: #55efc4;
      color: #006266;
    }
    
    .status-badge.completed {
      background-color: #2ecc71;
      color: white;
    }
    
    .status-badge.canceled {
      background-color: #e74c3c;
      color: white;
    }
    
    .order-actions {
      display: flex;
      gap: 10px;
    }
    
    .order-actions button {
      padding: 8px 15px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s;
    }
    
    .update-status {
      background-color: #3498db;
      color: white;
    }
    
    .generate-bill {
      background-color: #9b59b6;
      color: white;
    }
    
    .generate-bill:hover {
      background-color: #8e44ad;
    }
    
    .update-status:hover {
      background-color: #2980b9;
    }
    
    .update-status:disabled, .generate-bill:disabled {
      background-color: #95a5a6;
      cursor: not-allowed;
    }
    
    .order-details {
      padding: 20px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #eee;
    }
    
    .details-column {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    
    .detail-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .label {
      color: #7f8c8d;
      font-weight: 500;
      min-width: 80px;
    }
    
    .value {
      color: #2c3e50;
    }
    
    .value.total {
      font-size: 20px;
      font-weight: bold;
      color: #2c3e50;
    }
    
    .order-items {
      padding: 20px;
    }
    
    h2 {
      font-size: 18px;
      color: #2c3e50;
      margin-bottom: 15px;
    }
    
    .items-table {
      margin-bottom: 20px;
    }
    
    .table-header {
      display: flex;
      background-color: #f8f9fa;
      padding: 10px 15px;
      border-radius: 4px;
      font-weight: 500;
      color: #2c3e50;
    }
    
    .table-row {
      display: flex;
      padding: 15px;
      border-bottom: 1px solid #eee;
    }
    
    .col {
      display: flex;
      align-items: center;
    }
    
    .product-col {
      flex: 3;
    }
    
    .quantity-col, .price-col, .total-col, .actions-col {
      flex: 1;
      justify-content: center;
    }
    
    .product-name {
      font-weight: 500;
    }
    
    .product-notes {
      font-size: 14px;
      color: #7f8c8d;
      font-style: italic;
      margin-top: 5px;
    }
    
    .quantity-controls {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .qty-btn {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background-color: #3498db;
      color: white;
      border: none;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    
    .qty-btn:disabled {
      background-color: #95a5a6;
      cursor: not-allowed;
    }
    
    .quantity {
      font-weight: 500;
    }
    
    .remove-btn {
      padding: 5px 10px;
      background-color: #e74c3c;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .remove-btn:disabled {
      background-color: #95a5a6;
      cursor: not-allowed;
    }
    
    .items-summary {
      margin-top: 20px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      align-items: flex-end;
    }
    
    .summary-row {
      display: flex;
      gap: 20px;
      font-weight: 500;
    }
    
    .grand-total {
      font-size: 18px;
      font-weight: bold;
      color: #2c3e50;
    }
    
    .order-actions-bottom {
      padding: 20px;
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      border-top: 1px solid #eee;
    }
    
    .action-btn {
      padding: 10px 15px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s;
    }
    
    .action-btn:disabled {
      background-color: #95a5a6;
      color: white;
      cursor: not-allowed;
    }
    
    .add-product {
      background-color: #3498db;
      color: white;
    }
    
    .add-product:hover:not(:disabled) {
      background-color: #2980b9;
    }
    
    .update-order {
      background-color: #2ecc71;
      color: white;
    }
    
    .update-order:hover:not(:disabled) {
      background-color: #27ae60;
    }
    
    .cancel-order {
      background-color: #e74c3c;
      color: white;
    }
    
    .cancel-order:hover {
      background-color: #c0392b;
    }
    
    .no-items {
      padding: 30px;
      text-align: center;
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
      width: 500px;
      max-width: 90%;
    }
    
    .modal-header {
      padding: 15px 20px;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
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
    
    .modal-footer {
      padding: 15px 20px;
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      border-top: 1px solid #eee;
    }
    
    .btn {
      padding: 10px 15px;
      background-color: #ecf0f1;
      color: #2c3e50;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .primary-btn {
      padding: 10px 15px;
      background-color: #3498db;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .danger-btn {
      padding: 10px 15px;
      background-color: #e74c3c;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .print-btn {
      padding: 10px 15px;
      background-color: #27ae60;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
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
    
    /* Estilos para la cuenta */
    .bill-items {
      margin-top: 20px;
      max-height: 300px;
      overflow-y: auto;
    }
    
    .bill-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    
    .bill-table th, .bill-table td {
      padding: 8px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }
    
    .bill-table th {
      background-color: #f8f9fa;
      font-weight: 500;
    }
    
    .bill-total-label {
      text-align: right;
      font-weight: bold;
    }
    
    .bill-total-value {
      font-weight: bold;
    }
    
    h4 {
      margin-top: 0;
      color: #2c3e50;
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
    }
  `]
})
export class OrderDetailComponent implements OnInit {
  orderId: number = 0;
  
  // Datos de la orden
  order = {
    id: 0,
    tableNumber: 0,
    server: '',
    date: new Date(),
    status: 'Pendiente',
    items: [] as any[],
    originalItems: [] as any[] // Para comparar cambios
  };
  
  // Datos para la cuenta generada
  groupedItems: any[] = [];
  billTotal: number = 0;
  
  orderChanged = false;
  showCancelModal = false;
  showSaveModal = false;
  showBillModal = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtener el ID de la orden de la URL
    this.route.params.subscribe(params => {
      this.orderId = Number(params['id']);
      this.loadOrderDetails();
    });
  }
  
  loadOrderDetails(): void {
    // En una aplicación real, aquí se cargarían los datos de la orden desde un servicio
    // Por ahora, simulamos datos de ejemplo basados en el ID
    
    // Datos simulados para la orden
    const items = [
      {
        id: 1,
        name: 'Hamburguesa Clásica',
        price: 10.99,
        quantity: 2,
        notes: 'Sin cebolla'
      },
      {
        id: 2,
        name: 'Papas fritas',
        price: 4.99,
        quantity: 1
      },
      {
        id: 3,
        name: 'Refresco de cola',
        price: 2.50,
        quantity: 2
      }
    ];
    
    const orderData = {
      id: this.orderId,
      tableNumber: 5,
      server: 'Juan Pérez',
      date: new Date(),
      status: 'Pendiente',
      items: items,
      originalItems: JSON.parse(JSON.stringify(items))
    };
    
    this.order = orderData;
  }
  
  getStatusClass(): string {
    switch (this.order.status) {
      case 'Pendiente': return 'pending';
      case 'En preparación': return 'inProgress';
      case 'Listo': return 'ready';
      case 'Completada': return 'completed';
      case 'Cancelada': return 'canceled';
      default: return '';
    }
  }
  
  updateStatus(): void {
    switch (this.order.status) {
      case 'Pendiente':
        this.order.status = 'En preparación';
        break;
      case 'En preparación':
        this.order.status = 'Listo';
        break;
      case 'Listo':
        this.order.status = 'Completada';
        break;
    }
    
    // En una aplicación real, aquí se actualizaría el estado en el servidor
    console.log(`Orden #${this.order.id} actualizada a: ${this.order.status}`);
  }
  
  increaseQuantity(item: any): void {
    item.quantity++;
    this.checkForChanges();
  }
  
  decreaseQuantity(item: any): void {
    if (item.quantity > 1) {
      item.quantity--;
      this.checkForChanges();
    }
  }

  removeItem(index: number): void {
    this.order.items.splice(index, 1);
    this.checkForChanges();
  }
  
  calculateOrderTotal(): number {
    return this.order.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }
  
  checkForChanges(): void {
    // Verificar si hay cambios en los productos para habilitar/deshabilitar el botón de guardar
    if (this.order.items.length !== this.order.originalItems.length) {
      this.orderChanged = true;
      return;
    }
    
    for (let i = 0; i < this.order.items.length; i++) {
      const currentItem = this.order.items[i];
      const originalItem = this.order.originalItems.find(item => item.id === currentItem.id);
      
      if (!originalItem || currentItem.quantity !== originalItem.quantity) {
        this.orderChanged = true;
        return;
      }
    }
    
    this.orderChanged = false;
  }
  
  saveChanges(): void {
    // En una aplicación real, aquí se enviarían los cambios al servidor
    console.log('Cambios guardados en la orden:', {
      id: this.order.id,
      items: this.order.items
    });
    
    // Actualizar los productos originales para reflejar los cambios
    this.order.originalItems = JSON.parse(JSON.stringify(this.order.items));
    this.orderChanged = false;
    
    // Mostrar modal de confirmación
    this.showSaveModal = true;
  }
  
  cancelOrder(): void {
    this.showCancelModal = true;
  }
  
  confirmCancelOrder(): void {
    this.order.status = 'Cancelada';
    
    // En una aplicación real, aquí se enviaría la cancelación al servidor
    console.log(`Orden #${this.order.id} cancelada`);
    
    this.showCancelModal = false;
  }
  
  closeModals(): void {
    this.showCancelModal = false;
    this.showSaveModal = false;
    this.showBillModal = false;
  }
  
  canEditOrder(): boolean {
    // Solo se puede editar si la orden no está completada o cancelada
    return this.order.status !== 'Completada' && this.order.status !== 'Cancelada';
  }
  
  // Nuevas funciones para la generación de cuenta
  canGenerateBill(): boolean {
    // Solo se puede generar cuenta si hay productos y la orden no está cancelada
    return this.order.items.length > 0 && this.order.status !== 'Cancelada';
  }
  
  generateBill(): void {
    // Agrupar productos iguales para la cuenta
    this.groupItems();
    this.billTotal = this.calculateOrderTotal();
    this.showBillModal = true;
  }
  
  groupItems(): void {
    // Crear un mapa para agrupar productos por ID
    const itemMap = new Map();
    
    // Agrupar productos iguales
    this.order.items.forEach(item => {
      if (itemMap.has(item.id)) {
        // Si ya existe, incrementar la cantidad
        const existingItem = itemMap.get(item.id);
        existingItem.quantity += item.quantity;
      } else {
        // Si no existe, agregar una copia del elemento
        itemMap.set(item.id, {...item});
      }
    });
    
    // Convertir el mapa en un array
    this.groupedItems = Array.from(itemMap.values());
  }
  
  printBill(): void {
    // En una aplicación real, aquí se implementaría la funcionalidad de impresión
    console.log('Imprimiendo cuenta:', {
      id: this.order.id,
      items: this.groupedItems,
      total: this.billTotal
    });
    
    // Simular impresión exitosa
    alert('Cuenta enviada a impresión');
  }
}