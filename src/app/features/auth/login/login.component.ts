import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h1>Iniciar Sesión</h1>
        <form class="login-form">
          <div class="form-group">
            <label for="username">Usuario</label>
            <input type="text" id="username" placeholder="Ingresa tu usuario">
          </div>
          <div class="form-group">
            <label for="password">Contraseña</label>
            <input type="password" id="password" placeholder="Ingresa tu contraseña">
          </div>
          <div class="form-actions">
            <button type="button" routerLink="/dashboard">Iniciar Sesión</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background-color: #f5f5f5;
    }
    
    .login-card {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      padding: 30px;
      width: 100%;
      max-width: 400px;
    }
    
    h1 {
      text-align: center;
      color: #2c3e50;
      margin-bottom: 30px;
    }
    
    .login-form {
      display: flex;
      flex-direction: column;
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
      color: #495057;
    }
    
    input {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
    }
    
    .form-actions {
      margin-top: 20px;
    }
    
    button {
      width: 100%;
      padding: 12px;
      background-color: #2c3e50;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    
    button:hover {
      background-color: #1a2530;
    }
  `]
})
export class LoginComponent {} 