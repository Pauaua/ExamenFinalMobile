import { Injectable } from '@angular/core';
import { SyncService } from './sync.service';
import { NotificationService } from './notification.service';
import { AuthService } from './auth.service';

export interface Activity {
  id: string;
  userId: string; // ID del usuario al que pertenece la actividad
  titulo: string;
  descripcion: string;
  fecha: Date;
  hora: string;
  ubicacion: string;
  tipo: string; // ej. trabajo, personal, social, etc.
  completada: boolean;
  prioridad: 'baja' | 'media' | 'alta';
}

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {
  private activities: Activity[] = [];
  private idCounter = 1;

  constructor(
    private syncService: SyncService,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {
    // Cargar actividades locales al iniciar
    this.activities = this.syncService.getLocalActivities();
    if (this.activities.length > 0) {
      // Actualizar el contador de ID basado en las actividades existentes
      const maxId = Math.max(...this.activities.map(a => parseInt(a.id)), 0);
      this.idCounter = maxId + 1;
    }
  }

  // Obtener todas las actividades del usuario actual
  getActivities(): Activity[] {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return [];
    }
    return this.activities.filter(activity => activity.userId === currentUser.id);
  }

  // Obtener una actividad por ID (solo si pertenece al usuario actual)
  getActivityById(id: string): Activity | undefined {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return undefined;
    }
    return this.activities.find(activity =>
      activity.id === id && activity.userId === currentUser.id
    );
  }

  // Crear una nueva actividad
  crearActivity(activity: Omit<Activity, 'id' | 'userId'>): Activity {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('No hay usuario autenticado');
    }

    const nuevaActivity: Activity = {
      ...activity,
      id: this.idCounter.toString(),
      userId: currentUser.id
    };
    this.activities.push(nuevaActivity);
    this.idCounter++;

    // Añadir a la cola de sincronización
    this.syncService.addToSyncQueue({
      id: nuevaActivity.id,
      type: 'activity',
      operation: 'create',
      data: nuevaActivity
    });

    // Programar notificación para la actividad
    this.notificationService.scheduleActivityNotification(nuevaActivity, 15);

    return nuevaActivity;
  }

  // Actualizar una actividad existente
  actualizarActivity(id: string, activityActualizada: Partial<Activity>): boolean {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return false;
    }

    const index = this.activities.findIndex(activity =>
      activity.id === id && activity.userId === currentUser.id
    );
    if (index !== -1) {
      const actividadAnterior = { ...this.activities[index] };
      this.activities[index] = { ...this.activities[index], ...activityActualizada };

      // Añadir a la cola de sincronización
      this.syncService.addToSyncQueue({
        id: id,
        type: 'activity',
        operation: 'update',
        data: this.activities[index]
      });

      // Actualizar notificación si es necesario
      const actividadActual = this.activities[index];
      // Cancelar notificación anterior si las fechas cambiaron
      if (actividadAnterior.fecha !== actividadActual.fecha) {
        this.notificationService.cancelNotification(parseInt(id) + 1000);
        this.notificationService.scheduleActivityNotification(actividadActual, 15);
      }

      return true;
    }
    return false;
  }

  // Eliminar una actividad
  eliminarActivity(id: string): boolean {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return false;
    }

    const index = this.activities.findIndex(activity =>
      activity.id === id && activity.userId === currentUser.id
    );
    if (index !== -1) {
      const activityEliminada = this.activities[index];
      this.activities.splice(index, 1);

      // Añadir a la cola de sincronización
      this.syncService.addToSyncQueue({
        id: id,
        type: 'activity',
        operation: 'delete',
        data: activityEliminada
      });

      // Cancelar notificación asociada
      this.notificationService.cancelNotification(parseInt(id) + 1000);

      return true;
    }
    return false;
  }

  // Sincronizar actividades con el servidor
  async sincronizarActividades(): Promise<Activity[]> {
    const actividadesActualizadas = await this.syncService.syncActivitiesWithServer(this.activities);
    this.activities = actividadesActualizadas;
    return this.activities;
  }

  // Programar notificaciones para todas las actividades
  async programarNotificaciones(): Promise<void> {
    for (const activity of this.activities) {
      await this.notificationService.scheduleActivityNotification(activity, 15);
    }
  }
}