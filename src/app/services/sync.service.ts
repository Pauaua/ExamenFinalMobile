import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Evento } from './eventos';
import { Activity } from './activities.service';

export interface SyncQueueItem {
  id: string;
  type: 'evento' | 'activity';
  operation: 'create' | 'update' | 'delete';
  data?: Evento | Activity;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class SyncService {
  private syncQueueSubject = new BehaviorSubject<SyncQueueItem[]>([]);
  public syncQueue$ = this.syncQueueSubject.asObservable();

  private isOnline = true;
  private syncInProgress = false;

  constructor() {
    this.loadSyncQueue();
    this.checkConnectionStatus();
  }

  private checkConnectionStatus() {
    // Verificar si hay conexión a internet
    if (typeof navigator !== 'undefined') {
      this.isOnline = navigator.onLine;
      
      // Escuchar eventos de conexión
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.processSyncQueue();
      });
      
      window.addEventListener('offline', () => {
        this.isOnline = false;
      });
    }
  }

  // Añadir operación a la cola de sincronización
  addToSyncQueue(item: Omit<SyncQueueItem, 'timestamp'>): void {
    const queueItem: SyncQueueItem = {
      ...item,
      timestamp: Date.now()
    };
    
    const currentQueue = this.syncQueueSubject.value;
    const updatedQueue = [...currentQueue, queueItem];
    
    this.syncQueueSubject.next(updatedQueue);
    this.saveSyncQueue(updatedQueue);
    
    // Si estamos online, procesar la cola inmediatamente
    if (this.isOnline) {
      this.processSyncQueue();
    }
  }

  // Procesar la cola de sincronización
  async processSyncQueue(): Promise<void> {
    if (this.syncInProgress || !this.isOnline) {
      return;
    }

    this.syncInProgress = true;
    
    try {
      const queue = [...this.syncQueueSubject.value];
      
      for (const item of queue) {
        try {
          // Simular la sincronización con el servidor
          await this.syncItem(item);
          
          // Remover el item de la cola después de sincronizar
          const updatedQueue = this.syncQueueSubject.value.filter(q => q.id !== item.id);
          this.syncQueueSubject.next(updatedQueue);
          this.saveSyncQueue(updatedQueue);
        } catch (error) {
          console.error('Error sincronizando item:', error);
          // En una implementación real, podrías manejar reintentos o errores
        }
      }
    } finally {
      this.syncInProgress = false;
    }
  }

  // Simular la sincronización de un item
  private async syncItem(item: SyncQueueItem): Promise<void> {
    // Simular una operación de red
    return new Promise(resolve => {
      setTimeout(() => {
        console.log(`Item sincronizado: ${item.type} - ${item.operation} - ${item.id}`);
        resolve();
      }, 500);
    });
  }

  // Cargar la cola de sincronización desde el almacenamiento local
  private loadSyncQueue(): void {
    if (typeof localStorage !== 'undefined') {
      const queueData = localStorage.getItem('syncQueue');
      if (queueData) {
        try {
          const queue = JSON.parse(queueData);
          this.syncQueueSubject.next(queue);
        } catch (error) {
          console.error('Error al cargar la cola de sincronización:', error);
          this.syncQueueSubject.next([]);
        }
      }
    }
  }

  // Guardar la cola de sincronización en el almacenamiento local
  private saveSyncQueue(queue: SyncQueueItem[]): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('syncQueue', JSON.stringify(queue));
    }
  }

  // Obtener el estado de la conexión
  getIsOnline(): boolean {
    return this.isOnline;
  }

  // Obtener la cola de sincronización
  getSyncQueue(): SyncQueueItem[] {
    return this.syncQueueSubject.value;
  }

  // Limpiar la cola de sincronización
  clearSyncQueue(): void {
    this.syncQueueSubject.next([]);
    this.saveSyncQueue([]);
  }

  // Sincronizar eventos locales con el servidor
  async syncEventsWithServer(events: Evento[]): Promise<Evento[]> {
    if (!this.isOnline) {
      // Si no hay conexión, guardar en localStorage
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('localEvents', JSON.stringify(events));
      }
      return events;
    }

    // Si hay conexión, sincronizar con el servidor
    try {
      // Simular la sincronización con el servidor
      const syncedEvents = await this.simulateServerSync(events);
      
      // Guardar en localStorage
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('localEvents', JSON.stringify(syncedEvents));
      }
      
      return syncedEvents;
    } catch (error) {
      console.error('Error sincronizando eventos:', error);
      // En caso de error, guardar en localStorage
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('localEvents', JSON.stringify(events));
      }
      return events;
    }
  }

  // Sincronizar actividades locales con el servidor
  async syncActivitiesWithServer(activities: Activity[]): Promise<Activity[]> {
    if (!this.isOnline) {
      // Si no hay conexión, guardar en localStorage
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('localActivities', JSON.stringify(activities));
      }
      return activities;
    }

    // Si hay conexión, sincronizar con el servidor
    try {
      // Simular la sincronización con el servidor
      const syncedActivities = await this.simulateServerSync(activities);
      
      // Guardar en localStorage
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('localActivities', JSON.stringify(syncedActivities));
      }
      
      return syncedActivities;
    } catch (error) {
      console.error('Error sincronizando actividades:', error);
      // En caso de error, guardar en localStorage
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('localActivities', JSON.stringify(activities));
      }
      return activities;
    }
  }

  // Simular la sincronización con el servidor
  private async simulateServerSync<T>(items: T[]): Promise<T[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('Sincronización con servidor simulada');
        resolve(items);
      }, 1000);
    });
  }

  // Obtener eventos locales del almacenamiento
  getLocalEvents(): Evento[] {
    if (typeof localStorage !== 'undefined') {
      const eventsData = localStorage.getItem('localEvents');
      if (eventsData) {
        try {
          return JSON.parse(eventsData);
        } catch (error) {
          console.error('Error al cargar eventos locales:', error);
          return [];
        }
      }
    }
    return [];
  }

  // Obtener actividades locales del almacenamiento
  getLocalActivities(): Activity[] {
    if (typeof localStorage !== 'undefined') {
      const activitiesData = localStorage.getItem('localActivities');
      if (activitiesData) {
        try {
          return JSON.parse(activitiesData);
        } catch (error) {
          console.error('Error al cargar actividades locales:', error);
          return [];
        }
      }
    }
    return [];
  }
}