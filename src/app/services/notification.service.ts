import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Evento } from './eventos';
import { Activity } from './activities.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsEnabled = true;
  private scheduledNotifications: { id: number; timeoutId: number }[] = [];

  constructor(
    private platform: Platform,
    private authService: AuthService
  ) {
    this.initializeNotifications();
  }

  private initializeNotifications() {
    // Verificar si Notification API está disponible en el navegador
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        this.notificationsEnabled = true;
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          this.notificationsEnabled = permission === 'granted';
        });
      }
    } else {
      // Si no está disponible, usar alertas como fallback
      this.notificationsEnabled = true;
    }
  }

  // Programar notificación para un evento
  scheduleEventNotification(evento: Evento, minutosAntes: number = 15): void {
    if (!this.authService.getCurrentUser()?.preferenciasNotificacion?.pushHabilitadas) {
      return;
    }

    const fechaEvento = new Date(evento.fecha);
    const tiempoNotificacion = new Date(fechaEvento.getTime() - (minutosAntes * 60 * 1000));

    // Verificar que la fecha de notificación no sea en el pasado
    if (tiempoNotificacion < new Date()) {
      return;
    }

    const tiempoHastaNotificacion = tiempoNotificacion.getTime() - Date.now();

    const timeoutId = window.setTimeout(() => {
      this.showNotification(`Recordatorio: ${evento.titulo}`, `Tu evento "${evento.titulo}" comienza en ${minutosAntes} minutos`);
      // Remover de la lista de notificaciones programadas
      this.scheduledNotifications = this.scheduledNotifications.filter(n => n.id !== parseInt(evento.id));
    }, tiempoHastaNotificacion) as unknown as number;

    // Agregar a la lista de notificaciones programadas
    this.scheduledNotifications.push({ id: parseInt(evento.id), timeoutId });
  }

  // Programar notificación para una actividad
  scheduleActivityNotification(activity: Activity, minutosAntes: number = 15): void {
    if (!this.authService.getCurrentUser()?.preferenciasNotificacion?.pushHabilitadas) {
      return;
    }

    const fechaActivity = new Date(activity.fecha);
    const tiempoNotificacion = new Date(fechaActivity.getTime() - (minutosAntes * 60 * 1000));

    // Verificar que la fecha de notificación no sea en el pasado
    if (tiempoNotificacion < new Date()) {
      return;
    }

    const tiempoHastaNotificacion = tiempoNotificacion.getTime() - Date.now();

    const timeoutId = window.setTimeout(() => {
      this.showNotification(`Recordatorio: ${activity.titulo}`, `Tu actividad "${activity.titulo}" comienza en ${minutosAntes} minutos`);
      // Remover de la lista de notificaciones programadas
      this.scheduledNotifications = this.scheduledNotifications.filter(n => n.id !== (parseInt(activity.id) + 1000));
    }, tiempoHastaNotificacion) as unknown as number;

    // Agregar a la lista de notificaciones programadas
    this.scheduledNotifications.push({ id: parseInt(activity.id) + 1000, timeoutId });
  }

  // Programar notificaciones para múltiples eventos
  scheduleMultipleEventNotifications(eventos: Evento[], minutosAntes: number = 15): void {
    for (const evento of eventos) {
      if (evento.notificacionHabilitada) {
        this.scheduleEventNotification(evento, minutosAntes);
      }
    }
  }

  // Programar notificaciones para múltiples actividades
  scheduleMultipleActivityNotifications(activities: Activity[], minutosAntes: number = 15): void {
    for (const activity of activities) {
      this.scheduleActivityNotification(activity, minutosAntes);
    }
  }

  // Cancelar notificación específica
  cancelNotification(id: number): void {
    const notificationIndex = this.scheduledNotifications.findIndex(n => n.id === id);
    if (notificationIndex !== -1) {
      const notification = this.scheduledNotifications[notificationIndex];
      clearTimeout(notification.timeoutId);
      this.scheduledNotifications.splice(notificationIndex, 1);
    }
  }

  // Cancelar todas las notificaciones
  cancelAllNotifications(): void {
    for (const notification of this.scheduledNotifications) {
      clearTimeout(notification.timeoutId);
    }
    this.scheduledNotifications = [];
  }

  // Verificar si las notificaciones están habilitadas
  areNotificationsEnabled(): boolean {
    return this.notificationsEnabled;
  }

  // Mostrar notificación
  private showNotification(title: string, body: string): void {
    if (this.notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
      // Usar Notification API del navegador
      new Notification(title, {
        body: body,
        icon: 'assets/icon/favicon.png' // Puedes cambiar esta ruta por un icono real
      });
    } else {
      // Fallback: usar alerta del navegador
      alert(`${title}\n${body}`);
    }
  }

  // Enviar notificación inmediata (para pruebas)
  sendImmediateNotification(title: string, body: string): void {
    this.showNotification(title, body);
  }
}