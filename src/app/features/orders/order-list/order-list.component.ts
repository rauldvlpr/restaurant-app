import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="orders-container">
      <h2>Órdenes</h2>
      
      <div class="action-bar">
        <button class="new-order-btn" (click)="createNewOrder()">Nueva Orden</button>
        <div class="filters">
          <input type="text" placeholder="Buscar órdenes..." [(ngModel)]="searchTerm" (input)="filterOrders()">
          <select [(ngModel)]="statusFilter" (change)="filterOrders()">
            <option value="all">Todas</option>
            <option value="Pendiente">Pendientes</option>
            <option value="Completada">Completadas</option>
            <option value="Cancelada">Canceladas</option>
          </select>
        </div>
      </div>

      <div class="orders-list">
        <div class="order-item" *ngFor="let order of filteredOrders" [ngClass]="getStatusClass(order.status)">
          <div class="order-info">
            <span class="order-id">Orden #{{order.id}}</span>
            <span class="order-date">{{order.date}}</span>
            <span class="order-status">{{order.status}}</span>
          </div>
          <div class="order-actions">
            <button class="view-btn" [routerLink]="['/orders', order.id]">Ver detalles</button>
            <button class="update-btn" (click)="updateOrderStatus(order)">
              <span *ngIf="order.status === 'Pendiente'">Completar</span>
              <span *ngIf="order.status === 'Completada'">Cerrar</span>
              <span *ngIf="order.status === 'Cancelada'">Reactivar</span>
            </button>
            <button class="bill-btn" *ngIf="order.status === 'Completada'" (click)="generateBill(order)">
              Generar Cuenta
            </button>
          </div>
        </div>
        
        <div class="no-orders" *ngIf="filteredOrders.length === 0">
          No se encontraron órdenes
        </div>
      </div>
      
      <!-- Modal de cuenta generada -->
      <div class="bill-modal" *ngIf="showBillModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Cuenta para Orden #{{selectedOrder?.id}}</h3>
            <button class="close-btn" (click)="closeBillModal()">&times;</button>
          </div>
          <div class="modal-body">
            <div class="bill-details" id="billContent">
              <div class="bill-header">
                <div class="restaurant-name">Restaurante App</div>
                <div class="bill-date">Fecha: {{currentDate | date:'yyyy-MM-dd HH:mm'}}</div>
              </div>
              
              <div class="order-summary">
                <div class="summary-row">
                  <span>Número de Orden:</span>
                  <span>#{{selectedOrder?.id}}</span>
                </div>
                <div class="summary-row">
                  <span>Fecha de Orden:</span>
                  <span>{{selectedOrder?.date}}</span>
                </div>
                <div class="summary-row">
                  <span>Cantidad de Items:</span>
                  <span>{{selectedOrder?.items}}</span>
                </div>
              </div>
              
              <div class="bill-total">
                <div class="total-row">
                  <span>Subtotal:</span>
                  <span>\${{(selectedOrder?.total || 0).toFixed(2)}}</span>
                </div>
                <div class="total-row">
                  <span>IVA (16%):</span>
                  <span>\${{((selectedOrder?.total || 0) * 0.16).toFixed(2)}}</span>
                </div>
                <div class="total-row grand-total">
                  <span>Total:</span>
                  <span>\${{((selectedOrder?.total || 0) * 1.16).toFixed(2)}}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="print-btn" (click)="printBill()">Imprimir</button>
            <button class="email-btn" (click)="emailBill()">Enviar por Email</button>
          </div>
        </div>
      </div>
      
      <!-- Overlay cuando el modal está abierto -->
      <div class="overlay" *ngIf="showBillModal" (click)="closeBillModal()"></div>
    </div>
  `,
  styles: [`
    .orders-container {
      padding: 20px;
      position: relative;
    }
    
    h2 {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 20px;
      color: #2c3e50;
    }
    
    .action-bar {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      align-items: center;
    }
    
    .new-order-btn {
      background-color: #27ae60;
      color: white;
      border: none;
      padding: 10px 15px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.3s;
    }
    
    .new-order-btn:hover {
      background-color: #219955;
    }
    
    .filters {
      display: flex;
      gap: 10px;
    }
    
    .filters input, .filters select {
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }
    
    .orders-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    
    .order-item {
      background: white;
      border-radius: 8px;
      padding: 15px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-left: 4px solid #3498db;
    }
    
    .order-item.pending {
      border-left-color: #f39c12;
    }
    
    .order-item.completed {
      border-left-color: #27ae60;
    }
    
    .order-item.cancelled {
      border-left-color: #e74c3c;
    }
    
    .order-info {
      display: flex;
      gap: 15px;
    }
    
    .order-id {
      font-weight: bold;
      color: #2c3e50;
    }
    
    .order-date {
      color: #7f8c8d;
    }
    
    .order-status {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
      background-color: #f39c12;
      color: white;
    }
    
    .completed .order-status {
      background-color: #27ae60;
    }
    
    .cancelled .order-status {
      background-color: #e74c3c;
    }
    
    .order-actions {
      display: flex;
      gap: 10px;
    }
    
    button {
      padding: 8px 12px;
      border-radius: 4px;
      border: none;
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.3s;
    }
    
    .view-btn {
      background: #3498db;
      color: white;
    }
    
    .view-btn:hover {
      background: #2980b9;
    }
    
    .update-btn {
      background: #f39c12;
      color: white;
    }
    
    .update-btn:hover {
      background: #e67e22;
    }
    
    .bill-btn {
      background: #9b59b6;
      color: white;
    }
    
    .bill-btn:hover {
      background: #8e44ad;
    }
    
    .no-orders {
      text-align: center;
      padding: 30px;
      color: #7f8c8d;
      font-style: italic;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    /* Modal Styles */
    .bill-modal {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      width: 600px;
      max-width: 90%;
      border-radius: 8px;
      z-index: 1001;
      box-shadow: 0 5px 20px rgba(0,0,0,0.2);
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
    
    .bill-details {
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 20px;
    }
    
    .bill-header {
      text-align: center;
      margin-bottom: 20px;
    }
    
    .restaurant-name {
      font-size: 24px;
      font-weight: bold;
      color: #2c3e50;
      margin-bottom: 5px;
    }
    
    .restaurant-info {
      margin: 10px 0;
      font-size: 14px;
      color: #2c3e50;
    }
    
    .bill-date {
      color: #7f8c8d;
      font-size: 14px;
      margin-top: 10px;
    }
    
    .order-summary {
      margin-bottom: 20px;
      padding-bottom: 20px;
      border-bottom: 1px solid #eee;
    }
    
    .summary-row, .total-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      font-size: 14px;
    }
    
    .grand-total {
      font-weight: bold;
      font-size: 16px;
      color: #2c3e50;
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid #eee;
    }
    
    .billing-info, .social-media, .thank-you-message {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }
    
    .billing-info h4, .social-media h4 {
      font-size: 16px;
      color: #2c3e50;
      margin-bottom: 10px;
    }
    
    .billing-info p {
      font-size: 14px;
      margin-bottom: 5px;
    }
    
    .qr-placeholder {
      width: 100px;
      height: 100px;
      background-color: #f8f9fa;
      border: 1px solid #ddd;
      margin: 10px auto;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
    }
    
    .social-links {
      display: flex;
      flex-direction: column;
      gap: 5px;
      font-size: 14px;
    }
    
    .thank-you-message {
      text-align: center;
      font-style: italic;
      font-size: 14px;
    }
    
    .thank-you-message p {
      margin: 5px 0;
    }
    
    .modal-footer {
      padding: 15px 20px;
      border-top: 1px solid #eee;
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
    
    .print-btn {
      background: #3498db;
      color: white;
    }
    
    .email-btn {
      background: #2ecc71;
      color: white;
    }
    
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      z-index: 1000;
    }
  `]
})
export class OrderListComponent {
  orders = [
    { id: 1, date: '2023-05-10', status: 'Pendiente', items: 4, total: 45.97 },
    { id: 2, date: '2023-05-09', status: 'Completada', items: 3, total: 32.50 },
    { id: 3, date: '2023-05-08', status: 'Cancelada', items: 2, total: 18.75 },
    { id: 4, date: '2023-05-08', status: 'Pendiente', items: 5, total: 53.40 },
    { id: 5, date: '2023-05-07', status: 'Completada', items: 2, total: 24.99 }
  ];
  
  filteredOrders = [...this.orders];
  searchTerm = '';
  statusFilter = 'all';
  
  // Modal de cuenta
  showBillModal = false;
  selectedOrder: any = null;
  currentDate = new Date();
  
  constructor(private router: Router) {}
  
  createNewOrder() {
    // Navegar a la página de creación de ordenes
    this.router.navigate(['/orders/create']);
  }
  
  updateOrderStatus(order: any) {
    // Cambiar el estado de la orden según su estado actual
    if (order.status === 'Pendiente') {
      order.status = 'Completada';
    } else if (order.status === 'Completada') {
      order.status = 'Cancelada';
    } else if (order.status === 'Cancelada') {
      order.status = 'Pendiente';
    }
    
    // En una aplicación real, aquí enviarías la actualización al backend
    console.log(`Orden #${order.id} actualizada a: ${order.status}`);
  }
  
  filterOrders() {
    // Filtrar las órdenes según los criterios de búsqueda
    this.filteredOrders = this.orders.filter(order => {
      // Filtrar por término de búsqueda (id o fecha)
      const matchesSearch = this.searchTerm === '' || 
        order.id.toString().includes(this.searchTerm) ||
        order.date.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      // Filtrar por estado
      const matchesStatus = this.statusFilter === 'all' || 
        order.status === this.statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }
  
  getStatusClass(status: string): string {
    switch (status) {
      case 'Pendiente': return 'pending';
      case 'Completada': return 'completed';
      case 'Cancelada': return 'cancelled';
      default: return '';
    }
  }
  
  generateBill(order: any) {
    this.selectedOrder = order;
    this.currentDate = new Date();
    this.showBillModal = true;
  }
  
  closeBillModal() {
    this.showBillModal = false;
  }
  
  printBill() {
    console.log(`Generando PDF para la orden #${this.selectedOrder.id}`);
    
    // Crear un elemento temporal para el PDF completo
    const tempDiv = document.createElement('div');
    tempDiv.className = 'bill-details';
    
    // Estructura completa del PDF con todos los detalles
    tempDiv.innerHTML = `
      <div class="bill-header">
        <div class="restaurant-name">Restaurante App</div>
        <div class="restaurant-info">
          <div>Av. Principal #123, Colonia Centro</div>
          <div>Ciudad de México, CP 06000</div>
          <div>Tel: (55) 1234-5678</div>
          <div>RFC: RESTAPP123456</div>
        </div>
        <div class="bill-date">Fecha: ${this.currentDate.toLocaleDateString('es-MX')} ${this.currentDate.toLocaleTimeString('es-MX')}</div>
      </div>
      
      <div class="order-summary">
        <div class="summary-row">
          <span>Número de Orden:</span>
          <span>#${this.selectedOrder?.id}</span>
        </div>
        <div class="summary-row">
          <span>Fecha de Orden:</span>
          <span>${this.selectedOrder?.date}</span>
        </div>
        <div class="summary-row">
          <span>Cantidad de Items:</span>
          <span>${this.selectedOrder?.items}</span>
        </div>
      </div>
      
      <div class="bill-total">
        <div class="total-row">
          <span>Subtotal:</span>
          <span>$${(this.selectedOrder?.total || 0).toFixed(2)}</span>
        </div>
        <div class="total-row">
          <span>IVA (16%):</span>
          <span>$${((this.selectedOrder?.total || 0) * 0.16).toFixed(2)}</span>
        </div>
        <div class="total-row grand-total">
          <span>Total:</span>
          <span>$${((this.selectedOrder?.total || 0) * 1.16).toFixed(2)}</span>
        </div>
      </div>
      
      <div class="billing-info">
        <h4>Datos para Facturación</h4>
        <p>Para solicitar su factura, envíe sus datos fiscales a: <strong>facturacion@restauranteapp.com</strong></p>
        <p>O escanee el siguiente código QR para facturar en línea:</p>
        <div class="qr-placeholder">QR CODE</div>
      </div>
      
      <div class="social-media">
        <h4>Síguenos en redes sociales</h4>
        <div class="social-links">
          <span>Facebook: @RestauranteApp</span>
          <span>Instagram: @restaurante_app</span>
          <span>Twitter: @RestauranteApp</span>
        </div>
      </div>
      
      <div class="thank-you-message">
        <p>¡Gracias por su preferencia!</p>
        <p>Esperamos verle pronto nuevamente.</p>
      </div>
    `;
    
    // Aplicar estilos al elemento temporal
    tempDiv.style.backgroundColor = 'white';
    tempDiv.style.padding = '20px';
    tempDiv.style.border = '1px solid #ddd';
    tempDiv.style.borderRadius = '4px';
    
    // Añadir temporalmente al DOM para convertirlo a canvas
    document.body.appendChild(tempDiv);
    
    // Configuración de html2canvas
    const options = {
      background: 'white',
      scale: 3
    };
    
    // Convertir el contenido HTML a un canvas
    html2canvas(tempDiv, options).then((canvas) => {
      // Eliminar el elemento temporal del DOM
      document.body.removeChild(tempDiv);
      
      // Crear el PDF con jsPDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Añadir imagen del canvas al PDF
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 190; // Ancho disponible en PDF A4 en mm
      const pageHeight = 297; // Altura de A4 en mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Añadir título al PDF
      pdf.setFontSize(16);
      pdf.setTextColor(44, 62, 80); // Color #2c3e50
      pdf.text('COMPROBANTE DE PAGO', pdf.internal.pageSize.getWidth() / 2, 10, { align: 'center' });
      
      // Añadir la imagen al PDF con un margen superior adicional para el título
      pdf.addImage(imgData, 'PNG', 10, 15, imgWidth, imgHeight);
      
      // Añadir pie de página al PDF
      const pageCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.setTextColor(127, 140, 141); // Color #7f8c8d
        
        // Añadir número de página
        pdf.text(`Página ${i} de ${pageCount}`, pdf.internal.pageSize.getWidth() / 2, pdf.internal.pageSize.getHeight() - 10, { align: 'center' });
        
        // Añadir fecha y hora de generación
        const today = new Date();
        const dateStr = today.toLocaleDateString('es-MX');
        const timeStr = today.toLocaleTimeString('es-MX');
        pdf.text(`Documento generado el ${dateStr} a las ${timeStr}`, pdf.internal.pageSize.getWidth() / 2, pdf.internal.pageSize.getHeight() - 5, { align: 'center' });
      }
      
      // Guardar el PDF con nombre personalizado
      pdf.save(`Cuenta_Orden_${this.selectedOrder.id}.pdf`);
      
      // Mostrar notificación al usuario
      alert('PDF generado correctamente');
    }).catch(error => {
      console.error('Error al generar el PDF:', error);
      alert('Error al generar el PDF. Por favor, intente nuevamente.');
    });
  }
  
  emailBill() {
    console.log(`Enviando cuenta por email para la orden #${this.selectedOrder.id}`);
    // En una aplicación real, aquí se implementaría el envío de email
    alert('Cuenta enviada por email correctamente');
  }
} 