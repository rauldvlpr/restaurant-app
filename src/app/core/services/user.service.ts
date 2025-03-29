import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'api/users';

  constructor(private http: HttpClient) {}

  getUsers(params?: any): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl, { params })
      .pipe(
        catchError(error => {
          console.error('Error fetching users', error);
          return throwError('Error al obtener los usuarios');
        })
      );
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error(`Error fetching user with id ${id}`, error);
          return throwError('Error al obtener los detalles del usuario');
        })
      );
  }

  createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Observable<User> {
    return this.http.post<User>(this.apiUrl, user)
      .pipe(
        catchError(error => {
          console.error('Error creating user', error);
          return throwError('Error al crear el usuario');
        })
      );
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${user.id}`, user)
      .pipe(
        catchError(error => {
          console.error(`Error updating user with id ${user.id}`, error);
          return throwError('Error al actualizar el usuario');
        })
      );
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error(`Error deleting user with id ${id}`, error);
          return throwError('Error al eliminar el usuario');
        })
      );
  }
} 