import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="edit-order-container">
      <div class="page-header">
        <h1>Agregar Productos a Orden #{{orderId}}</h1>
        <div class="header-actions">
          <button class="back-btn" [routerLink]="['/orders', orderId]">Volver al detalle</button>
        </div>
      </div>
      
      <div class="order-form">
        <div class="menu-section">
          <h2>Agregar Productos</h2>
          
          <div class="menu-categories">
            <button class="category-btn" [class.active]="selectedCategory === 'all'" (click)="filterByCategory('all')">Todos</button>
            <button class="category-btn" [class.active]="selectedCategory === 'Entradas'" (click)="filterByCategory('Entradas')">Entradas</button>
            <button class="category-btn" [class.active]="selectedCategory === 'Principales'" (click)="filterByCategory('Principales')">Platos Principales</button>
            <button class="category-btn" [class.active]="selectedCategory === 'Postres'" (click)="filterByCategory('Postres')">Postres</button>
            <button class="category-btn" [class.active]="selectedCategory === 'Bebidas'" (click)="filterByCategory('Bebidas')">Bebidas</button>
          </div>
          
          <div class="menu-search">
            <input type="text" placeholder="Buscar productos..." [(ngModel)]="searchTerm" (input)="filterItems()">
          </div>
          
          <div class="menu-items">
            <div class="menu-item" *ngFor="let item of filteredItems">
              <div class="item-info">
                <h3>{{item.name}}</h3>
                <p>{{item.description}}</p>
                <div class="item-price">\${{item.price.toFixed(2)}}</div>
              </div>
              <div class="item-actions">
                <button class="add-btn" (click)="addItemToOrder(item)">Agregar</button>
              </div>
            </div>
            
            <div class="no-items" *ngIf="filteredItems.length === 0">
              No se encontraron productos
            </div>
          </div>
        </div>
        
        <div class="order-summary">
          <h2>Productos Seleccionados</h2>
          
          <div class="summary-message" *ngIf="selectedItems.length === 0">
            No hay productos seleccionados
          </div>
          
          <div class="selected-items" *ngIf="selectedItems.length > 0">
            <div class="selected-item" *ngFor="let item of selectedItems; let i = index">
              <div class="item-info">
                <h3>{{item.name}}</h3>
                <div class="item-price">\${{item.price.toFixed(2)}} x {{item.quantity}}</div>
                <div class="item-subtotal">\${{(item.price * item.quantity).toFixed(2)}}</div>
              </div>
              <div class="quantity-controls">
                <button class="qty-btn" (click)="decreaseQuantity(item)">-</button>
                <span class="quantity">{{item.quantity}}</span>
                <button class="qty-btn" (click)="increaseQuantity(item)">+</button>
              </div>
              <div class="item-actions">
                <button class="remove-btn" (click)="removeItem(i)">×</button>
              </div>
            </div>
            
            <div class="order-total">
              <span class="total-label">Total:</span>
              <span class="total-amount">\${{calculateTotal().toFixed(2)}}</span>
            </div>
          </div>
          
          <div class="order-actions">
            <button class="create-btn" (click)="addProductsToOrder()" [disabled]="isLoading || selectedItems.length === 0">
              <span *ngIf="!isLoading">Agregar a la Orden</span>
              <span *ngIf="isLoading">Procesando...</span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Modal de confirmación de productos agregados -->
      <div class="modal" *ngIf="showConfirmationModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Productos Agregados</h3>
          </div>
          <div class="modal-body">
            <p>Los productos han sido agregados a la orden correctamente.</p>
          </div>
          <div class="modal-footer">
            <button class="btn" (click)="goToOrderDetail()">Ver Orden</button>
            <button class="primary-btn" (click)="continueAdding()">Continuar Agregando</button>
          </div>
        </div>
      </div>
      
      <!-- Overlay cuando el modal está abierto -->
      <div class="overlay" *ngIf="showConfirmationModal"></div>
    </div>
  `,
  styles: [`
    .edit-order-container {
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
    
    .order-form {
      display: grid;
      grid-template-columns: 3fr 2fr;
      gap: 20px;
    }
    
    @media (max-width: 768px) {
      .order-form {
        grid-template-columns: 1fr;
      }
    }
    
    h2 {
      font-size: 18px;
      color: #2c3e50;
      margin-bottom: 15px;
    }
    
    .menu-categories {
      display: flex;
      gap: 10px;
      margin-bottom: 15px;
      flex-wrap: wrap;
    }
    
    .category-btn {
      padding: 8px 15px;
      background-color: #f8f9fa;
      border: 1px solid #ddd;
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.3s;
    }
    
    .category-btn.active {
      background-color: #3498db;
      color: white;
      border-color: #3498db;
    }
    
    .menu-search {
      margin-bottom: 15px;
    }
    
    .menu-search input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
    }
    
    .menu-items {
      display: grid;
      gap: 15px;
      max-height: 400px;
      overflow-y: auto;
    }
    
    .menu-item {
      padding: 15px;
      border-radius: 8px;
      background-color: white;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .item-info {
      flex: 1;
    }
    
    .item-info h3 {
      margin: 0 0 5px;
      font-size: 16px;
    }
    
    .item-info p {
      margin: 0 0 10px;
      font-size: 14px;
      color: #7f8c8d;
    }
    
    .item-price {
      font-weight: bold;
      color: #2c3e50;
    }
    
    .item-subtotal {
      font-size: 14px;
      color: #3498db;
      margin-top: 5px;
    }
    
    .add-btn {
      background-color: #3498db;
      color: white;
      border: none;
      padding: 8px 15px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s;
    }
    
    .add-btn:hover {
      background-color: #2980b9;
    }
    
    .order-summary {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      padding: 20px;
    }
    
    .summary-message {
      text-align: center;
      padding: 20px;
      color: #7f8c8d;
      font-style: italic;
    }
    
    .selected-items {
      display: flex;
      flex-direction: column;
      gap: 15px;
      max-height: 350px;
      overflow-y: auto;
      margin-bottom: 20px;
    }
    
    .selected-item {
      padding: 15px;
      border-radius: 8px;
      background-color: #f8f9fa;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
    }
    
    .quantity-controls {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .qty-btn {
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #3498db;
      color: white;
      border: none;
      border-radius: 50%;
      font-size: 18px;
      cursor: pointer;
    }
    
    .quantity {
      font-weight: bold;
      min-width: 30px;
      text-align: center;
    }
    
    .remove-btn {
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #e74c3c;
      color: white;
      border: none;
      border-radius: 50%;
      font-size: 18px;
      cursor: pointer;
    }
    
    .order-total {
      display: flex;
      justify-content: space-between;
      font-size: 18px;
      font-weight: bold;
      padding: 15px 0;
      border-top: 1px solid #eee;
      margin-top: 15px;
    }
    
    .total-amount {
      color: #2c3e50;
    }
    
    .order-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
    }
    
    .create-btn {
      background-color: #2ecc71;
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: 4px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s;
    }
    
    .create-btn:hover {
      background-color: #27ae60;
    }
    
    .create-btn:disabled {
      background-color: #95a5a6;
      cursor: not-allowed;
    }
    
    .no-items {
      text-align: center;
      padding: 20px;
      color: #7f8c8d;
      font-style: italic;
      background-color: #f8f9fa;
      border-radius: 4px;
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
    }
    
    .modal-header h3 {
      margin: 0;
      font-size: 18px;
      color: #2c3e50;
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
export class OrderEditComponent implements OnInit {
  orderId: number = 0;
  
  // Datos del menú
  menuItems = [
    {
      id: 1,
      name: 'Ensalada César',
      description: 'Lechuga romana, crutones, queso parmesano y aderezo César',
      price: 8.99,
      category: 'Entradas'
    },
    {
      id: 2,
      name: 'Pasta Alfredo',
      description: 'Fettuccine con salsa cremosa de queso parmesano',
      price: 12.99,
      category: 'Principales'
    },
    {
      id: 3,
      name: 'Hamburguesa Clásica',
      description: 'Carne de res, queso cheddar, lechuga, tomate y cebolla',
      price: 10.99,
      category: 'Principales'
    },
    {
      id: 4,
      name: 'Limonada',
      description: 'Limonada fresca con hojas de menta',
      price: 3.99,
      category: 'Bebidas'
    },
    {
      id: 5,
      name: 'Pastel de Chocolate',
      description: 'Pastel húmedo de chocolate con cobertura de ganache',
      price: 6.99,
      category: 'Postres'
    },
    {
      id: 6,
      name: 'Nachos con Queso',
      description: 'Totopos con queso derretido, jalapeños y guacamole',
      price: 7.99,
      category: 'Entradas'
    },
    {
      id: 7,
      name: 'Filete de Salmón',
      description: 'Filete de salmón a la parrilla con salsa de limón y hierbas',
      price: 16.99,
      category: 'Principales'
    },
    {
      id: 8,
      name: 'Refresco',
      description: 'Refresco de cola, lima-limón o naranja',
      price: 2.50,
      category: 'Bebidas'
    }
  ];
  
  // Estado del formulario
  selectedItems: any[] = [];
  
  // Filtrado de productos
  filteredItems: any[] = [];
  searchTerm = '';
  selectedCategory = 'all';
  
  // Control de estado
  isLoading = false;
  showConfirmationModal = false;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.filteredItems = [...this.menuItems];
  }
  
  ngOnInit(): void {
    // Obtener el ID de la orden de la URL
    this.route.params.subscribe(params => {
      this.orderId = Number(params['id']);
    });
  }
  
  filterItems() {
    this.filteredItems = this.menuItems.filter(item => {
      // Filtrar por término de búsqueda
      const matchesSearch = this.searchTerm === '' || 
        item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      // Filtrar por categoría
      const matchesCategory = this.selectedCategory === 'all' || 
        item.category === this.selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }
  
  filterByCategory(category: string) {
    this.selectedCategory = category;
    this.filterItems();
  }
  
  addItemToOrder(item: any) {
    // Verificar si el producto ya está en los seleccionados
    const existingItem = this.selectedItems.find(selectedItem => selectedItem.id === item.id);
    
    if (existingItem) {
      // Si ya existe, aumentar la cantidad
      existingItem.quantity++;
    } else {
      // Si no existe, agregar el producto con cantidad 1
      this.selectedItems.push({
        ...item,
        quantity: 1
      });
    }
  }
  
  increaseQuantity(item: any) {
    item.quantity++;
  }
  
  decreaseQuantity(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      // Si la cantidad llega a 0, eliminar el producto
      const index = this.selectedItems.findIndex(selectedItem => selectedItem.id === item.id);
      if (index !== -1) {
        this.removeItem(index);
      }
    }
  }
  
  removeItem(index: number) {
    this.selectedItems.splice(index, 1);
  }
  
  calculateTotal(): number {
    return this.selectedItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }
  
  addProductsToOrder() {
    if (this.selectedItems.length === 0) {
      return;
    }
    
    this.isLoading = true;
    
    // Simular una llamada a la API con un timeout
    setTimeout(() => {
      // En una aplicación real, aquí se enviarían los productos a agregar al servidor
      console.log('Agregando productos a la orden:', {
        orderId: this.orderId,
        items: this.selectedItems,
        total: this.calculateTotal()
      });
      
      this.isLoading = false;
      this.showConfirmationModal = true;
    }, 1000);
  }
  
  goToOrderDetail() {
    this.router.navigate(['/orders', this.orderId]);
  }
  
  continueAdding() {
    this.selectedItems = [];
    this.showConfirmationModal = false;
  }
} 