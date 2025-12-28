import { Injectable } from '@angular/core';
import { Evento } from './eventos';
import { Activity } from './activities.service';
import { AuthService } from './auth.service';

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  calendarType: 'google' | 'outlook' | 'apple' | 'local';
}

@Injectable({
  providedIn: 'root'
})
export class CalendarIntegrationService {
  private supportedCalendars = ['google', 'outlook', 'apple', 'local'];

  constructor(private authService: AuthService) { }

  // Sincronizar evento con calendario externo
  async syncEventToCalendar(evento: Evento, calendarType: 'google' | 'outlook' | 'apple' | 'local'): Promise<boolean> {
    try {
      // Simular la sincronización con el calendario externo
      const calendarEvent: CalendarEvent = {
        id: evento.id,
        title: evento.titulo,
        description: evento.descripcion,
        startDate: new Date(evento.fecha),
        endDate: this.calculateEndDate(new Date(evento.fecha), evento.hora),
        location: evento.ubicacion,
        calendarType
      };

      // Simular la operación de red
      await this.simulateCalendarSync(calendarEvent);
      
      console.log(`Evento ${evento.id} sincronizado con ${calendarType} calendar`);
      return true;
    } catch (error) {
      console.error(`Error al sincronizar evento ${evento.id} con ${calendarType} calendar:`, error);
      return false;
    }
  }

  // Sincronizar actividad con calendario externo
  async syncActivityToCalendar(activity: Activity, calendarType: 'google' | 'outlook' | 'apple' | 'local'): Promise<boolean> {
    try {
      // Simular la sincronización con el calendario externo
      const calendarEvent: CalendarEvent = {
        id: activity.id,
        title: activity.titulo,
        description: activity.descripcion,
        startDate: new Date(activity.fecha),
        endDate: this.calculateEndDate(new Date(activity.fecha), activity.hora),
        location: activity.ubicacion,
        calendarType
      };

      // Simular la operación de red
      await this.simulateCalendarSync(calendarEvent);
      
      console.log(`Actividad ${activity.id} sincronizada con ${calendarType} calendar`);
      return true;
    } catch (error) {
      console.error(`Error al sincronizar actividad ${activity.id} con ${calendarType} calendar:`, error);
      return false;
    }
  }

  // Importar eventos desde calendario externo
  async importEventsFromCalendar(calendarType: 'google' | 'outlook' | 'apple'): Promise<Evento[]> {
    try {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        console.error('No hay usuario autenticado para importar eventos');
        return [];
      }

      // Simular la importación de eventos desde el calendario externo
      const calendarEvents = await this.simulateCalendarImport(calendarType);

      // Convertir los eventos del calendario a eventos de la aplicación
      const eventos: Evento[] = calendarEvents.map(ce => ({
        id: ce.id,
        userId: currentUser.id,
        titulo: ce.title,
        descripcion: ce.description,
        fecha: ce.startDate,
        hora: ce.startDate.toTimeString().substring(0, 5),
        ubicacion: ce.location || '',
        notificacionHabilitada: true,
        recordatorioMinutos: 15
      }));

      console.log(`Importados ${eventos.length} eventos desde ${calendarType} calendar`);
      return eventos;
    } catch (error) {
      console.error(`Error al importar eventos desde ${calendarType} calendar:`, error);
      return [];
    }
  }

  // Importar actividades desde calendario externo
  async importActivitiesFromCalendar(calendarType: 'google' | 'outlook' | 'apple'): Promise<Activity[]> {
    try {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        console.error('No hay usuario autenticado para importar actividades');
        return [];
      }

      // Simular la importación de actividades desde el calendario externo
      const calendarEvents = await this.simulateCalendarImport(calendarType);

      // Convertir los eventos del calendario a actividades de la aplicación
      const activities: Activity[] = calendarEvents.map(ce => ({
        id: ce.id,
        userId: currentUser.id,
        titulo: ce.title,
        descripcion: ce.description,
        fecha: ce.startDate,
        hora: ce.startDate.toTimeString().substring(0, 5),
        ubicacion: ce.location || '',
        tipo: 'importado',
        completada: false,
        prioridad: 'media'
      }));

      console.log(`Importadas ${activities.length} actividades desde ${calendarType} calendar`);
      return activities;
    } catch (error) {
      console.error(`Error al importar actividades desde ${calendarType} calendar:`, error);
      return [];
    }
  }

  // Sincronizar múltiples eventos con calendario externo
  async syncMultipleEventsToCalendar(eventos: Evento[], calendarType: 'google' | 'outlook' | 'apple' | 'local'): Promise<boolean> {
    let successCount = 0;
    const totalCount = eventos.length;

    for (const evento of eventos) {
      const success = await this.syncEventToCalendar(evento, calendarType);
      if (success) {
        successCount++;
      }
    }

    console.log(`Sincronizados ${successCount}/${totalCount} eventos con ${calendarType} calendar`);
    return successCount === totalCount;
  }

  // Sincronizar múltiples actividades con calendario externo
  async syncMultipleActivitiesToCalendar(activities: Activity[], calendarType: 'google' | 'outlook' | 'apple' | 'local'): Promise<boolean> {
    let successCount = 0;
    const totalCount = activities.length;

    for (const activity of activities) {
      const success = await this.syncActivityToCalendar(activity, calendarType);
      if (success) {
        successCount++;
      }
    }

    console.log(`Sincronizadas ${successCount}/${totalCount} actividades con ${calendarType} calendar`);
    return successCount === totalCount;
  }

  // Verificar si un tipo de calendario es compatible
  isCalendarSupported(calendarType: string): boolean {
    return this.supportedCalendars.includes(calendarType);
  }

  // Simular la operación de sincronización con el calendario
  private async simulateCalendarSync(calendarEvent: CalendarEvent): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log(`Simulando sincronización con ${calendarEvent.calendarType} calendar para evento ${calendarEvent.id}`);
        resolve();
      }, 1000);
    });
  }

  // Simular la importación de eventos desde el calendario
  private async simulateCalendarImport(calendarType: 'google' | 'outlook' | 'apple'): Promise<CalendarEvent[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        // Simular algunos eventos importados
        const mockEvents: CalendarEvent[] = [
          {
            id: `mock-${Date.now()}-1`,
            title: `Evento importado de ${calendarType}`,
            description: `Evento importado desde ${calendarType} calendar`,
            startDate: new Date(Date.now() + 86400000), // Mañana
            endDate: new Date(Date.now() + 86400000 + 3600000), // Mañana + 1 hora
            location: 'Oficina',
            calendarType
          },
          {
            id: `mock-${Date.now()}-2`,
            title: `Reunión importada`,
            description: `Reunión importante importada desde ${calendarType}`,
            startDate: new Date(Date.now() + 172800000), // En 2 días
            endDate: new Date(Date.now() + 172800000 + 5400000), // En 2 días + 1.5 horas
            location: 'Sala de conferencias',
            calendarType
          }
        ];
        
        console.log(`Simulando importación de ${mockEvents.length} eventos desde ${calendarType} calendar`);
        resolve(mockEvents);
      }, 1500);
    });
  }

  // Calcular la fecha de finalización basada en la hora
  private calculateEndDate(startDate: Date, hora: string): Date {
    const [hours, minutes] = hora.split(':').map(Number);
    const endDate = new Date(startDate);
    endDate.setHours(hours, minutes, 0, 0);
    // Asumir duración de 1 hora si no se especifica
    endDate.setHours(endDate.getHours() + 1);
    return endDate;
  }
}