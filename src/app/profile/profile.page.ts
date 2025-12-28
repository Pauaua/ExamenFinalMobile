import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, User } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ProfilePage implements OnInit {
  currentUser: User | null = null;
  preferences: {
    pushHabilitadas: boolean;
    notificacionEmail: boolean;
    recordatorioMinutos: number;
  } = {
    pushHabilitadas: true,
    notificacionEmail: true,
    recordatorioMinutos: 15
  };

  isSaving = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser && this.currentUser.preferenciasNotificacion) {
      this.preferences = {
        pushHabilitadas: this.currentUser.preferenciasNotificacion.pushHabilitadas,
        notificacionEmail: this.currentUser.preferenciasNotificacion.notificacionEmail,
        recordatorioMinutos: this.currentUser.preferenciasNotificacion.recordatorioMinutos
      };
    }
  }

  async guardarCambios() {
    if (!this.currentUser) return;

    this.isSaving = true;

    try {
      // Actualizar las preferencias del usuario
      const success = await this.authService.updatePreferences({
        pushHabilitadas: this.preferences.pushHabilitadas,
        notificacionEmail: this.preferences.notificacionEmail,
        recordatorioMinutos: this.preferences.recordatorioMinutos
      });

      if (success) {
        // Actualizar el usuario actual en el servicio
        this.currentUser = this.authService.getCurrentUser();
        // Mostrar mensaje de éxito (en una implementación real, usaría un toast)
        console.log('Cambios guardados exitosamente');
      } else {
        console.error('Error al guardar los cambios');
      }
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
    } finally {
      this.isSaving = false;
    }
  }

  async cerrarSesion() {
    await this.authService.logout();
    this.router.navigate(['/home'], { replaceUrl: true });
  }
}
