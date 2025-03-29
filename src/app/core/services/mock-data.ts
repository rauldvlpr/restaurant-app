import { User } from '../../shared/models/user.model';
import { Category } from '../../shared/models/category.model';
import { Product } from '../../shared/models/product.model';
import { Order } from '../../shared/models/order.model';

export const MOCK_USERS: User[] = [
  { id: 1, username: 'admin', email: 'admin@example.com', password: 'admin123', role: 'admin', firstName: 'Admin', lastName: 'User', createdAt: new Date(), updatedAt: new Date() },
  { id: 2, username: 'waiter', email: 'waiter@example.com', password: 'waiter123', role: 'waiter', firstName: 'Waiter', lastName: 'User', createdAt: new Date(), updatedAt: new Date() },
  { id: 3, username: 'chef', email: 'chef@example.com', password: 'chef123', role: 'chef', firstName: 'Chef', lastName: 'User', createdAt: new Date(), updatedAt: new Date() }
];

export const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: 'Entradas', description: 'Platos para compartir', active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 2, name: 'Platos Principales', description: 'Platos fuertes', active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 3, name: 'Postres', description: 'Dulces y pasteles', active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 4, name: 'Bebidas', description: 'Refrescos y más', active: true, createdAt: new Date(), updatedAt: new Date() }
];

export const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: 'Nachos', description: 'Nachos con queso y guacamole', price: 8.99, categoryId: 1, category: MOCK_CATEGORIES[0], active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 2, name: 'Alitas BBQ', description: 'Alitas de pollo con salsa BBQ', price: 10.99, categoryId: 1, category: MOCK_CATEGORIES[0], active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 3, name: 'Hamburguesa', description: 'Hamburguesa con queso y bacon', price: 12.99, categoryId: 2, category: MOCK_CATEGORIES[1], active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 4, name: 'Pizza Margarita', description: 'Pizza con queso y tomate', price: 14.99, categoryId: 2, category: MOCK_CATEGORIES[1], active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 5, name: 'Tarta de Chocolate', description: 'Tarta de chocolate con nata', price: 6.99, categoryId: 3, category: MOCK_CATEGORIES[2], active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 6, name: 'Refresco', description: 'Refresco de cola', price: 2.99, categoryId: 4, category: MOCK_CATEGORIES[3], active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 7, name: 'Cerveza', description: 'Cerveza rubia', price: 3.99, categoryId: 4, category: MOCK_CATEGORIES[3], active: true, createdAt: new Date(), updatedAt: new Date() }
];

export const MOCK_ORDERS: Order[] = [
  { 
    id: 1, 
    tableNumber: 5, 
    status: 'pending', 
    total: 32.97, 
    waiterId: 2, 
    waiter: MOCK_USERS[1],
    items: [
      { id: 1, orderId: 1, productId: 1, product: MOCK_PRODUCTS[0], quantity: 1, price: 8.99, notes: '' },
      { id: 2, orderId: 1, productId: 3, product: MOCK_PRODUCTS[2], quantity: 1, price: 12.99, notes: 'Sin cebolla' },
      { id: 3, orderId: 1, productId: 6, product: MOCK_PRODUCTS[5], quantity: 2, price: 2.99, notes: '' }
    ],
    createdAt: new Date(), 
    updatedAt: new Date() 
  },
  { 
    id: 2, 
    tableNumber: 3, 
    status: 'completed', 
    total: 29.97, 
    waiterId: 2, 
    waiter: MOCK_USERS[1],
    items: [
      { id: 4, orderId: 2, productId: 2, product: MOCK_PRODUCTS[1], quantity: 1, price: 10.99, notes: 'Salsa extra' },
      { id: 5, orderId: 2, productId: 5, product: MOCK_PRODUCTS[4], quantity: 1, price: 6.99, notes: '' },
      { id: 6, orderId: 2, productId: 7, product: MOCK_PRODUCTS[6], quantity: 3, price: 3.99, notes: 'Bien fría' }
    ],
    createdAt: new Date(Date.now() - 60 * 60 * 1000), 
    updatedAt: new Date() 
  }
]; 