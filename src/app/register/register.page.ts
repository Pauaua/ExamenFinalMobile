import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, RegisterData } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class RegisterPage implements OnInit {
  registerData: RegisterData = {
    email: '',
    password: '',
    nombre: '',
    apellido: ''
  };

  confirmPassword: string = '';
  isRegistering = false;
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  async onRegister() {
    this.isRegistering = true;
    this.errorMessage = null;

    try {
      const result = await this.authService.register(this.registerData);

      if (result.success) {
        // Navegar a la página de login después del registro exitoso
        this.router.navigate(['/login'], { replaceUrl: true });
      } else {
        this.errorMessage = result.message;
      }
    } catch (error) {
      this.errorMessage = 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo.';
    } finally {
      this.isRegistering = false;
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
