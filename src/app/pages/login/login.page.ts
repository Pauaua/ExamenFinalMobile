import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, LoginCredentials } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {
  credentials: LoginCredentials = {
    email: '',
    password: ''
  };

  isLoggingIn = false;
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  async onLogin() {
    this.isLoggingIn = true;
    this.errorMessage = null;

    try {
      const result = await this.authService.login(this.credentials);

      if (result.success) {
        // Navegar a la página principal después del login
        this.router.navigate(['/home'], { replaceUrl: true });
      } else {
        this.errorMessage = result.message;
      }
    } catch (error) {
      this.errorMessage = 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo.';
    } finally {
      this.isLoggingIn = false;
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
