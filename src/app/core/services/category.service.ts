import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Category } from '../../shared/models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'api/categories';

  constructor(private http: HttpClient) {}

  getCategories(params?: any): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl, { params })
      .pipe(
        catchError(error => {
          console.error('Error fetching categories', error);
          return throwError('Error al obtener las categorías');
        })
      );
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error(`Error fetching category with id ${id}`, error);
          return throwError('Error al obtener los detalles de la categoría');
        })
      );
  }

  createCategory(category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category)
      .pipe(
        catchError(error => {
          console.error('Error creating category', error);
          return throwError('Error al crear la categoría');
        })
      );
  }

  updateCategory(category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${category.id}`, category)
      .pipe(
        catchError(error => {
          console.error(`Error updating category with id ${category.id}`, error);
          return throwError('Error al actualizar la categoría');
        })
      );
  }

  toggleCategoryStatus(id: number, active: boolean): Observable<Category> {
    return this.http.patch<Category>(`${this.apiUrl}/${id}/status`, { active })
      .pipe(
        catchError(error => {
          console.error(`Error toggling status of category with id ${id}`, error);
          return throwError('Error al cambiar el estado de la categoría');
        })
      );
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error(`Error deleting category with id ${id}`, error);
          return throwError('Error al eliminar la categoría');
        })
      );
  }
} 