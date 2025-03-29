import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Product } from '../../shared/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'api/products';

  constructor(private http: HttpClient) {}

  getProducts(params?: any): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl, { params })
      .pipe(
        catchError(error => {
          console.error('Error fetching products', error);
          return throwError('Error al obtener los productos');
        })
      );
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error(`Error fetching product with id ${id}`, error);
          return throwError('Error al obtener los detalles del producto');
        })
      );
  }

  createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product)
      .pipe(
        catchError(error => {
          console.error('Error creating product', error);
          return throwError('Error al crear el producto');
        })
      );
  }

  updateProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${product.id}`, product)
      .pipe(
        catchError(error => {
          console.error(`Error updating product with id ${product.id}`, error);
          return throwError('Error al actualizar el producto');
        })
      );
  }

  toggleProductStatus(id: number, active: boolean): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}/${id}/status`, { active })
      .pipe(
        catchError(error => {
          console.error(`Error toggling status of product with id ${id}`, error);
          return throwError('Error al cambiar el estado del producto');
        })
      );
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error(`Error deleting product with id ${id}`, error);
          return throwError('Error al eliminar el producto');
        })
      );
  }
} 