import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Order } from '../../shared/models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'api/orders';

  constructor(private http: HttpClient) {}

  getOrders(params?: any): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl, { params })
      .pipe(
        catchError(error => {
          console.error('Error fetching orders', error);
          return throwError('Error al obtener las comandas');
        })
      );
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error(`Error fetching order with id ${id}`, error);
          return throwError('Error al obtener los detalles de la comanda');
        })
      );
  }

  createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, order)
      .pipe(
        catchError(error => {
          console.error('Error creating order', error);
          return throwError('Error al crear la comanda');
        })
      );
  }

  updateOrder(order: Order): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${order.id}`, order)
      .pipe(
        catchError(error => {
          console.error(`Error updating order with id ${order.id}`, error);
          return throwError('Error al actualizar la comanda');
        })
      );
  }

  updateOrderStatus(orderId: number, status: 'pending' | 'in-progress' | 'completed' | 'paid'): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${orderId}/status`, { status })
      .pipe(
        catchError(error => {
          console.error(`Error updating status of order with id ${orderId}`, error);
          return throwError('Error al actualizar el estado de la comanda');
        })
      );
  }

  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error(`Error deleting order with id ${id}`, error);
          return throwError('Error al eliminar la comanda');
        })
      );
  }
} 