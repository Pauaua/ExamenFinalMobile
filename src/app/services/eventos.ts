import { Injectable } from '@angular/core';
import { SyncService } from './sync.service';
import { NotificationService } from './notification.service';
import { AuthService } from './auth.service';

export interface Evento {
  id: string;
  userId: string; // ID del usuario al que pertenece el evento
  titulo: string;
  descripcion: string;
  fecha: Date;
  hora: string;
  ubicacion: string;
  notificacionHabilitada: boolean;
  recordatorioMinutos: number;
}

@Injectable({
  providedIn: 'root'
})
export class EventosService {
  private eventos: Evento[] = [];
  private idCounter = 1;

  constructor(
    private syncService: SyncService,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {
    // Cargar eventos locales al iniciar
    this.eventos = this.syncService.getLocalEvents();
    if (this.eventos.length > 0) {
      // Actualizar el contador de ID basado en los eventos existentes
      const maxId = Math.max(...this.eventos.map(e => parseInt(e.id)), 0);
      this.idCounter = maxId + 1;
    }
  }

  // Obtener todos los eventos del usuario actual
  getEventos(): Evento[] {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return [];
    }
    return this.eventos.filter(evento => evento.userId === currentUser.id);
  }

  // Obtener un evento por ID (solo si pertenece al usuario actual)
  getEventoById(id: string): Evento | undefined {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return undefined;
    }
    return this.eventos.find(evento =>
      evento.id === id && evento.userId === currentUser.id
    );
  }

  // Crear un nuevo evento
  crearEvento(evento: Omit<Evento, 'id' | 'userId'>): Evento {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('No hay usuario autenticado');
    }

    const nuevoEvento: Evento = {
      ...evento,
      id: this.idCounter.toString(),
      userId: currentUser.id
    };
    this.eventos.push(nuevoEvento);
    this.idCounter++;

    // Añadir a la cola de sincronización
    this.syncService.addToSyncQueue({
      id: nuevoEvento.id,
      type: 'evento',
      operation: 'create',
      data: nuevoEvento
    });

    // Programar notificación si está habilitada
    if (nuevoEvento.notificacionHabilitada) {
      this.notificationService.scheduleEventNotification(nuevoEvento, nuevoEvento.recordatorioMinutos);
    }

    return nuevoEvento;
  }

  // Actualizar un evento existente
  actualizarEvento(id: string, eventoActualizado: Partial<Evento>): boolean {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return false;
    }

    const index = this.eventos.findIndex(evento =>
      evento.id === id && evento.userId === currentUser.id
    );
    if (index !== -1) {
      const eventoAnterior = { ...this.eventos[index] };
      this.eventos[index] = { ...this.eventos[index], ...eventoActualizado };

      // Añadir a la cola de sincronización
      this.syncService.addToSyncQueue({
        id: id,
        type: 'evento',
        operation: 'update',
        data: this.eventos[index]
      });

      // Actualizar notificación si es necesario
      const eventoActual = this.eventos[index];
      if (eventoActual.notificacionHabilitada) {
        // Cancelar notificación anterior si las fechas o recordatorios cambiaron
        if (eventoAnterior.fecha !== eventoActual.fecha ||
            eventoAnterior.recordatorioMinutos !== eventoActual.recordatorioMinutos) {
          this.notificationService.cancelNotification(parseInt(id));
          this.notificationService.scheduleEventNotification(eventoActual, eventoActual.recordatorioMinutos);
        }
      } else {
        // Si se deshabilitó la notificación, cancelarla
        this.notificationService.cancelNotification(parseInt(id));
      }

      return true;
    }
    return false;
  }

  // Eliminar un evento
  eliminarEvento(id: string): boolean {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return false;
    }

    const index = this.eventos.findIndex(evento =>
      evento.id === id && evento.userId === currentUser.id
    );
    if (index !== -1) {
      const eventoEliminado = this.eventos[index];
      this.eventos.splice(index, 1);

      // Añadir a la cola de sincronización
      this.syncService.addToSyncQueue({
        id: id,
        type: 'evento',
        operation: 'delete',
        data: eventoEliminado
      });

      // Cancelar notificación asociada
      this.notificationService.cancelNotification(parseInt(id));

      return true;
    }
    return false;
  }

  // Sincronizar eventos con el servidor
  async sincronizarEventos(): Promise<Evento[]> {
    const eventosActualizados = await this.syncService.syncEventsWithServer(this.eventos);
    this.eventos = eventosActualizados;
    return this.eventos;
  }

  // Programar notificaciones para todos los eventos
  async programarNotificaciones(): Promise<void> {
    for (const evento of this.eventos) {
      if (evento.notificacionHabilitada) {
        await this.notificationService.scheduleEventNotification(evento, evento.recordatorioMinutos);
      }
    }
  }

  // Simular la sincronización con calendario externo
  sincronizarConCalendarioExterno(): Promise<boolean> {
    return new Promise((resolve) => {
      // Simulación de la sincronización
      setTimeout(() => {
        console.log('Sincronización con calendario externo completada');
        resolve(true);
      }, 1000);
    });
  }
}
