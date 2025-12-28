import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface User {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  preferenciasNotificacion?: {
    pushHabilitadas: boolean;
    recordatorioMinutos: number;
    notificacionEmail: boolean;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private users: User[] = [
    // Usuario de ejemplo
    {
      id: '1',
      email: 'admin@example.com',
      nombre: 'Admin',
      apellido: 'User',
      preferenciasNotificacion: {
        pushHabilitadas: true,
        recordatorioMinutos: 15,
        notificacionEmail: true
      }
    }
  ];

  private passwords: { [userId: string]: string } = {
    '1': 'password123' // Contraseña de ejemplo
  };

  constructor() {
    // Verificar si hay un usuario en sesión
    this.checkStoredSession();
  }

  private checkStoredSession() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(credentials: LoginCredentials): Promise<{ success: boolean; message: string; user?: User }> {
    return new Promise((resolve) => {
      // Simular una llamada asíncrona
      setTimeout(() => {
        const user = this.users.find(u => u.email === credentials.email);

        if (user && this.passwords[user.id] === credentials.password) {
          this.currentUserSubject.next(user);
          localStorage.setItem('currentUser', JSON.stringify(user));
          resolve({ success: true, message: 'Inicio de sesión exitoso', user });
        } else {
          resolve({ success: false, message: 'Credenciales incorrectas' });
        }
      }, 500);
    });
  }

  register(userData: RegisterData): Promise<{ success: boolean; message: string; user?: User }> {
    return new Promise((resolve) => {
      // Simular una llamada asíncrona
      setTimeout(() => {
        // Verificar si el email ya existe
        const existingUser = this.users.find(u => u.email === userData.email);

        if (existingUser) {
          resolve({ success: false, message: 'El email ya está registrado' });
          return;
        }

        // Crear nuevo usuario
        const newUser: User = {
          id: (this.users.length + 1).toString(),
          email: userData.email,
          nombre: userData.nombre,
          apellido: userData.apellido,
          preferenciasNotificacion: {
            pushHabilitadas: true,
            recordatorioMinutos: 15,
            notificacionEmail: true
          }
        };

        this.users.push(newUser);
        this.passwords[newUser.id] = userData.password;

        this.currentUserSubject.next(newUser);
        localStorage.setItem('currentUser', JSON.stringify(newUser));

        resolve({ success: true, message: 'Usuario registrado exitosamente', user: newUser });
      }, 500);
    });
  }

  logout(): Promise<void> {
    return new Promise((resolve) => {
      this.currentUserSubject.next(null);
      localStorage.removeItem('currentUser');
      resolve();
    });
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  updatePreferences(preferences: User['preferenciasNotificacion']): Promise<boolean> {
    return new Promise((resolve) => {
      const currentUser = this.currentUserSubject.value;
      if (currentUser) {
        const userIndex = this.users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
          this.users[userIndex] = {
            ...this.users[userIndex],
            preferenciasNotificacion: preferences
          };

          // Actualizar el usuario actual en el BehaviorSubject
          const updatedUser = {
            ...currentUser,
            preferenciasNotificacion: preferences
          };
          this.currentUserSubject.next(updatedUser);
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));

          resolve(true);
        } else {
          resolve(false);
        }
      } else {
        resolve(false);
      }
    });
  }
}