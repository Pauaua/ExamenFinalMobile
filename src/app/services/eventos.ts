import { Injectable } from '@angular/core';

export interface Evento {
  id: string;
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

  constructor() { }

  // Obtener todos los eventos
  getEventos(): Evento[] {
    return this.eventos;
  }

  // Obtener un evento por ID
  getEventoById(id: string): Evento | undefined {
    return this.eventos.find(evento => evento.id === id);
  }

  // Crear un nuevo evento
  crearEvento(evento: Omit<Evento, 'id'>): Evento {
    const nuevoEvento: Evento = {
      ...evento,
      id: this.idCounter.toString()
    };
    this.eventos.push(nuevoEvento);
    this.idCounter++;
    return nuevoEvento;
  }

  // Actualizar un evento existente
  actualizarEvento(id: string, eventoActualizado: Partial<Evento>): boolean {
    const index = this.eventos.findIndex(evento => evento.id === id);
    if (index !== -1) {
      this.eventos[index] = { ...this.eventos[index], ...eventoActualizado };
      return true;
    }
    return false;
  }

  // Eliminar un evento
  eliminarEvento(id: string): boolean {
    const index = this.eventos.findIndex(evento => evento.id === id);
    if (index !== -1) {
      this.eventos.splice(index, 1);
      return true;
    }
    return false;
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
