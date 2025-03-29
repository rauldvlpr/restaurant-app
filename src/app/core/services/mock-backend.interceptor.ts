import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

// Datos mock
const users = [
  { id: 1, username: 'admin', email: 'admin@example.com', password: 'admin123', role: 'admin', firstName: 'Admin', lastName: 'User', createdAt: new Date(), updatedAt: new Date() },
  { id: 2, username: 'waiter', email: 'waiter@example.com', password: 'waiter123', role: 'waiter', firstName: 'Waiter', lastName: 'User', createdAt: new Date(), updatedAt: new Date() }
];

const categories = [
  { id: 1, name: 'Entradas', description: 'Platos para compartir', active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 2, name: 'Platos Principales', description: 'Platos fuertes', active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 3, name: 'Postres', description: 'Dulces y pasteles', active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 4, name: 'Bebidas', description: 'Refrescos y más', active: true, createdAt: new Date(), updatedAt: new Date() }
];

const products = [
  { id: 1, name: 'Nachos', description: 'Nachos con queso y guacamole', price: 8.99, categoryId: 1, active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 2, name: 'Alitas BBQ', description: 'Alitas de pollo con salsa BBQ', price: 10.99, categoryId: 1, active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 3, name: 'Hamburguesa', description: 'Hamburguesa con queso y bacon', price: 12.99, categoryId: 2, active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 4, name: 'Pizza Margarita', description: 'Pizza con queso y tomate', price: 14.99, categoryId: 2, active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 5, name: 'Tarta de Chocolate', description: 'Tarta de chocolate con nata', price: 6.99, categoryId: 3, active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 6, name: 'Refresco', description: 'Refresco de cola', price: 2.99, categoryId: 4, active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 7, name: 'Cerveza', description: 'Cerveza rubia', price: 3.99, categoryId: 4, active: true, createdAt: new Date(), updatedAt: new Date() }
];

const orders = [
  { 
    id: 1, 
    tableNumber: 5, 
    status: 'pending', 
    total: 32.97, 
    waiterId: 2, 
    waiter: users[1],
    items: [
      { id: 1, orderId: 1, productId: 1, product: products[0], quantity: 1, price: 8.99, notes: '' },
      { id: 2, orderId: 1, productId: 3, product: products[2], quantity: 1, price: 12.99, notes: 'Sin cebolla' },
      { id: 3, orderId: 1, productId: 6, product: products[5], quantity: 2, price: 2.99, notes: '' }
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
    waiter: users[1],
    items: [
      { id: 4, orderId: 2, productId: 2, product: products[1], quantity: 1, price: 10.99, notes: 'Salsa extra' },
      { id: 5, orderId: 2, productId: 5, product: products[4], quantity: 1, price: 6.99, notes: '' },
      { id: 6, orderId: 2, productId: 7, product: products[6], quantity: 3, price: 3.99, notes: 'Bien fría' }
    ],
    createdAt: new Date(Date.now() - 60 * 60 * 1000), 
    updatedAt: new Date() 
  }
];

@Injectable()
export class MockBackendInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;

    // Envolvemos en un dematerialize/materialize para simular el comportamiento real del servidor
    return of(null)
      .pipe(mergeMap(handleRoute))
      .pipe(materialize())
      .pipe(delay(500))
      .pipe(dematerialize());

    function handleRoute() {
      switch (true) {
        case url.endsWith('/auth/login') && method === 'POST':
          return authenticate();
        case url.match(/\/users\/\d+$/) && method === 'GET':
          return getUserById();
        case url.endsWith('/users') && method === 'GET':
          return getUsers();
        case url.match(/\/categories\/\d+$/) && method === 'GET':
          return getCategoryById();
        case url.endsWith('/categories') && method === 'GET':
          return getCategories();
        case url.match(/\/products\/\d+$/) && method === 'GET':
          return getProductById();
        case url.endsWith('/products') && method === 'GET':
          return getProducts();
        case url.match(/\/orders\/\d+$/) && method === 'GET':
          return getOrderById();
        case url.endsWith('/orders') && method === 'GET':
          return getOrders();
        case url.endsWith('/orders') && method === 'POST':
          return createOrder();
        case url.match(/\/orders\/\d+\/status$/) && method === 'PATCH':
          return updateOrderStatus();
        case url.match(/\/orders\/\d+$/) && method === 'PUT':
          return updateOrder();
        default:
          // Pasa las peticiones no manejadas al handler real
          return next.handle(request);
      }
    }

    // Funciones para manejar rutas específicas
    function authenticate() {
      const { username, password } = body;
      const user = users.find(x => x.username === username && x.password === password);
      if (!user) return error('El nombre de usuario o la contraseña son incorrectos');
      return ok({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        token: `fake-jwt-token.${user.id}`
      });
    }

    function getUserById() {
      if (!isLoggedIn()) return unauthorized();
      const user = users.find(x => x.id === idFromUrl());
      return ok(user);
    }

    function getUsers() {
      if (!isLoggedIn()) return unauthorized();
      return ok(users.map(x => {
        const { password, ...userWithoutPassword } = x;
        return userWithoutPassword;
      }));
    }

    function getCategoryById() {
      if (!isLoggedIn()) return unauthorized();
      const category = categories.find(x => x.id === idFromUrl());
      return ok(category);
    }

    function getCategories() {
      if (!isLoggedIn()) return unauthorized();
      return ok(categories);
    }

    function getProductById() {
      if (!isLoggedIn()) return unauthorized();
      const product = products.find(x => x.id === idFromUrl());
      if (product) {
        product.category = categories.find(x => x.id === product.categoryId);
      }
      return ok(product);
    }

    function getProducts() {
      if (!isLoggedIn()) return unauthorized();
      return ok(products.map(product => {
        return { 
          ...product, 
          category: categories.find(x => x.id === product.categoryId) 
        };
      }));
    }

    function getOrderById() {
      if (!isLoggedIn()) return unauthorized();
      const order = orders.find(x => x.id === idFromUrl());
      return ok(order);
    }

    function getOrders() {
      if (!isLoggedIn()) return unauthorized();
      return ok(orders);
    }

    function createOrder() {
      if (!isLoggedIn()) return unauthorized();
      const order = body;
      order.id = orders.length ? Math.max(...orders.map(x => x.id)) + 1 : 1;
      order.createdAt = new Date();
      order.updatedAt = new Date();
      order.waiter = users.find(x => x.id === Number(order.waiterId));
      
      // Procesamos los items
      order.items = order.items.map((item, index) => {
        const product = products.find(x => x.id === Number(item.productId));
        return {
          id: orders.reduce((acc, curr) => acc + curr.items.length, 0) + index + 1,
          orderId: order.id,
          productId: Number(item.productId),
          product,
          quantity: item.quantity,
          price: item.price,
          notes: item.notes || ''
        };
      });
      
      orders.push(order);
      return ok(order);
    }

    function updateOrderStatus() {
      if (!isLoggedIn()) return unauthorized();
      
      const orderId = idFromUrl();
      const { status } = body;
      const order = orders.find(x => x.id === orderId);
      
      if (!order) return error(`No se encontró la orden con id ${orderId}`);
      
      order.status = status;
      order.updatedAt = new Date();
      
      return ok(order);
    }

    function updateOrder() {
      if (!isLoggedIn()) return unauthorized();
      
      const orderId = idFromUrl();
      const orderIndex = orders.findIndex(x => x.id === orderId);
      
      if (orderIndex === -1) return error(`No se encontró la orden con id ${orderId}`);
      
      const updatedOrder = {
        ...orders[orderIndex],
        ...body,
        id: orderId,
        updatedAt: new Date()
      };
      
      // Actualizamos la referencia del mesero si es necesario
      if (updatedOrder.waiterId) {
        updatedOrder.waiter = users.find(x => x.id === Number(updatedOrder.waiterId));
      }
      
      // Procesamos los items si los hay
      if (updatedOrder.items) {
        updatedOrder.items = updatedOrder.items.map((item, index) => {
          const product = products.find(x => x.id === Number(item.productId));
          return {
            id: item.id || (orders.reduce((acc, curr) => acc + curr.items.length, 0) + index + 1),
            orderId,
            productId: Number(item.productId),
            product,
            quantity: item.quantity,
            price: item.price,
            notes: item.notes || ''
          };
        });
      }
      
      orders[orderIndex] = updatedOrder;
      return ok(updatedOrder);
    }

    // Funciones de utilidad
    function ok(body?) {
      return of(new HttpResponse({ status: 200, body }));
    }

    function error(message) {
      return throwError({ error: { message } });
    }

    function unauthorized() {
      return throwError({ status: 401, error: { message: 'No autorizado' } });
    }

    function isLoggedIn() {
      return headers.get('Authorization')?.includes('fake-jwt-token') || true; // Por simplicidad, siempre autorizamos
    }

    function idFromUrl() {
      const urlParts = url.split('/');
      return parseInt(urlParts[urlParts.length - 1], 10);
    }
  }
}

export const mockBackendProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: MockBackendInterceptor,
  multi: true
}; 