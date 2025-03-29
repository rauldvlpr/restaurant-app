import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../../shared/models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadUserFromLocalStorage();

    // Auto-login for development - comment out in production
    if (!this.currentUserValue) {
      this.autoLogin();
    }
  }

  private loadUserFromLocalStorage(): void {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        this.currentUserSubject.next(user);
      } catch (e) {
        localStorage.removeItem('currentUser');
      }
    }
  }

  // For development purposes only
  private autoLogin(): void {
    const user: User = {
      id: 1,
      username: 'admin',
      email: 'admin@example.com',
      role: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap(user => {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          this.router.navigate(['/dashboard']);
        }),
        catchError(error => {
          return throwError('Nombre de usuario o contraseña incorrectos');
        })
      );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

  hasRole(role: string): boolean {
    const user = this.currentUserValue;
    return !!user && user.role === role;
  }

  register(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, user)
      .pipe(
        catchError(error => {
          return throwError('Error al registrar el usuario');
        })
      );
  }
} 