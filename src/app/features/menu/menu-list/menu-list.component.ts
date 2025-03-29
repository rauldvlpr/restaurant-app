import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-menu-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="menu-container">
      <div class="page-header">
        <h1>Menú del Restaurante</h1>
        <div class="header-actions">
          <button class="add-btn" (click)="showAddEditModal(null)">
            <span class="add-icon">+</span>
            Añadir producto
          </button>
        </div>
      </div>
      
      <div class="filters-container">
        <div class="search-container">
          <input type="text" placeholder="Buscar productos..." [(ngModel)]="searchTerm" (input)="applyFilters()">
        </div>
        
        <div class="category-filter">
          <select [(ngModel)]="selectedCategory" (change)="applyFilters()">
            <option value="all">Todas las categorías</option>
            <option value="Entradas">Entradas</option>
            <option value="Principales">Platos Principales</option>
            <option value="Postres">Postres</option>
            <option value="Bebidas">Bebidas</option>
          </select>
        </div>
        
        <div class="sort-options">
          <select [(ngModel)]="sortBy" (change)="applyFilters()">
            <option value="name">Ordenar por Nombre</option>
            <option value="price-asc">Ordenar por Precio (menor a mayor)</option>
            <option value="price-desc">Ordenar por Precio (mayor a menor)</option>
          </select>
        </div>
      </div>
      
      <div class="menu-grid">
        <div class="menu-item" *ngFor="let item of filteredItems">
          <div class="item-image">
            <img src="https://via.placeholder.com/150" alt="{{item.name}}">
          </div>
          <div class="item-details">
            <div class="item-header">
              <h2>{{item.name}}</h2>
              <span class="item-price">\${{item.price.toFixed(2)}}</span>
            </div>
            <div class="item-category">{{item.category}}</div>
            <p class="item-description">{{item.description}}</p>
            <div class="item-actions">
              <button class="edit-btn" (click)="showAddEditModal(item)">Editar</button>
              <button class="delete-btn" (click)="deleteItem(item)">Eliminar</button>
            </div>
          </div>
        </div>
        
        <div class="no-results" *ngIf="filteredItems.length === 0">
          No se encontraron productos que coincidan con la búsqueda
        </div>
      </div>
      
      <!-- Modal para agregar/editar producto -->
      <div class="modal" *ngIf="showModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>{{isEditing ? 'Editar' : 'Añadir'}} Producto</h3>
            <button class="close-btn" (click)="closeModal()">&times;</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>Nombre</label>
              <input type="text" [(ngModel)]="currentItem.name">
            </div>
            <div class="form-group">
              <label>Descripción</label>
              <textarea [(ngModel)]="currentItem.description" rows="3"></textarea>
            </div>
            <div class="form-group">
              <label>Precio</label>
              <input type="number" [(ngModel)]="currentItem.price" step="0.01" min="0">
            </div>
            <div class="form-group">
              <label>Categoría</label>
              <select [(ngModel)]="currentItem.category">
                <option value="Entradas">Entradas</option>
                <option value="Principales">Principales</option>
                <option value="Postres">Postres</option>
                <option value="Bebidas">Bebidas</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button class="cancel-btn" (click)="closeModal()">Cancelar</button>
            <button class="save-btn" (click)="saveItem()" [disabled]="!isItemValid()">
              {{isEditing ? 'Actualizar' : 'Guardar'}}
            </button>
          </div>
        </div>
      </div>
      
      <!-- Overlay cuando el modal está abierto -->
      <div class="overlay" *ngIf="showModal" (click)="closeModal()"></div>
    </div>
  `,
  styles: [`
    .menu-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
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
    
    .add-btn {
      background-color: #3498db;
      color: white;
      border: none;
      padding: 10px 15px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s;
    }
    
    .add-btn:hover {
      background-color: #2980b9;
    }
    
    .add-icon {
      font-size: 18px;
      font-weight: bold;
    }
    
    .filters-container {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 15px;
      margin-bottom: 20px;
    }
    
    @media (max-width: 768px) {
      .filters-container {
        grid-template-columns: 1fr;
      }
    }
    
    .search-container input, .category-filter select, .sort-options select {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }
    
    .menu-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
    
    .menu-item {
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      background-color: white;
      transition: transform 0.3s, box-shadow 0.3s;
    }
    
    .menu-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
    
    .item-image {
      height: 150px;
      overflow: hidden;
    }
    
    .item-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .item-details {
      padding: 15px;
    }
    
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 5px;
    }
    
    .item-header h2 {
      font-size: 18px;
      margin: 0;
      color: #2c3e50;
    }
    
    .item-price {
      font-weight: bold;
      color: #3498db;
    }
    
    .item-category {
      font-size: 12px;
      background-color: #eee;
      padding: 3px 8px;
      border-radius: 10px;
      display: inline-block;
      color: #7f8c8d;
      margin-bottom: 10px;
    }
    
    .item-description {
      font-size: 14px;
      color: #7f8c8d;
      margin-bottom: 15px;
      line-height: 1.4;
    }
    
    .item-actions {
      display: flex;
      gap: 10px;
    }
    
    .edit-btn, .delete-btn {
      flex: 1;
      padding: 8px 0;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.3s;
    }
    
    .edit-btn {
      background-color: #f1c40f;
      color: #fff;
    }
    
    .edit-btn:hover {
      background-color: #f39c12;
    }
    
    .delete-btn {
      background-color: #e74c3c;
      color: white;
    }
    
    .delete-btn:hover {
      background-color: #c0392b;
    }
    
    .no-results {
      grid-column: 1 / -1;
      text-align: center;
      padding: 40px;
      background-color: #f8f9fa;
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
      width: 500px;
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
    
    .form-group input, .form-group select, .form-group textarea {
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
    
    .cancel-btn {
      padding: 10px 15px;
      background-color: #ecf0f1;
      color: #7f8c8d;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .save-btn {
      padding: 10px 15px;
      background-color: #2ecc71;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .save-btn:disabled {
      background-color: #95a5a6;
      cursor: not-allowed;
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
export class MenuListComponent {
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
  
  filteredItems: any[] = [];
  searchTerm = '';
  selectedCategory = 'all';
  sortBy = 'name';
  
  // Modal properties
  showModal = false;
  isEditing = false;
  currentItem: any = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    category: 'Principales'
  };
  
  constructor() {
    this.applyFilters();
  }
  
  applyFilters() {
    // Filtrar por término de búsqueda y categoría
    let filtered = this.menuItems.filter(item => {
      const matchesSearch = this.searchTerm === '' || 
        item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesCategory = this.selectedCategory === 'all' || 
        item.category === this.selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
    
    // Ordenar los resultados
    filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        default:
          return 0;
      }
    });
    
    this.filteredItems = filtered;
  }
  
  showAddEditModal(item: any) {
    this.isEditing = !!item;
    
    if (item) {
      // Editar un producto existente - hacer una copia para no modificar el original directamente
      this.currentItem = { ...item };
    } else {
      // Nuevo producto
      this.currentItem = {
        id: this.getNextId(),
        name: '',
        description: '',
        price: 0,
        category: 'Principales'
      };
    }
    
    this.showModal = true;
  }
  
  closeModal() {
    this.showModal = false;
  }
  
  saveItem() {
    if (!this.isItemValid()) return;
    
    if (this.isEditing) {
      // Actualizar producto existente
      const index = this.menuItems.findIndex(item => item.id === this.currentItem.id);
      if (index !== -1) {
        this.menuItems[index] = { ...this.currentItem };
      }
    } else {
      // Agregar nuevo producto
      this.menuItems.push({ ...this.currentItem });
    }
    
    // Refresca la lista filtrada
    this.applyFilters();
    
    // Cierra el modal
    this.closeModal();
    
    console.log(`Producto ${this.isEditing ? 'actualizado' : 'agregado'}: ${this.currentItem.name}`);
  }
  
  deleteItem(item: any) {
    if (confirm(`¿Estás seguro de eliminar "${item.name}"?`)) {
      const index = this.menuItems.findIndex(i => i.id === item.id);
      if (index !== -1) {
        this.menuItems.splice(index, 1);
        this.applyFilters();
        console.log(`Producto eliminado: ${item.name}`);
      }
    }
  }
  
  isItemValid(): boolean {
    return !!this.currentItem.name && 
           !!this.currentItem.description && 
           this.currentItem.price > 0 && 
           !!this.currentItem.category;
  }
  
  getNextId(): number {
    // Obtener el siguiente ID disponible
    return Math.max(0, ...this.menuItems.map(item => item.id)) + 1;
  }
} 