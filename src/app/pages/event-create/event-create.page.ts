import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventosService, Evento } from 'src/app/services/eventos';

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.page.html',
  styleUrls: ['./event-create.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class EventCreatePage implements OnInit {
  nuevoEvento: Partial<Evento> = {
    titulo: '',
    descripcion: '',
    fecha: new Date(),
    hora: '09:00',
    ubicacion: '',
    notificacionHabilitada: true,
    recordatorioMinutos: 15
  };
  esEdicion = false;
  eventoId: string | null = null;

  constructor(
    private eventosService: EventosService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.eventoId = id;
        this.esEdicion = true;
        const evento = this.eventosService.getEventoById(id);
        if (evento) {
          this.nuevoEvento = { ...evento };
        }
      }
    });
  }

  guardarEvento() {
    if (this.nuevoEvento.titulo && this.nuevoEvento.fecha) {
      if (this.esEdicion && this.eventoId) {
        // Actualizar evento existente
        this.eventosService.actualizarEvento(this.eventoId, this.nuevoEvento as Partial<Evento>);
        this.router.navigate(['/eventos']);
      } else {
        // Crear nuevo evento
        this.eventosService.crearEvento(this.nuevoEvento as Omit<Evento, 'id' | 'userId'>);
        this.router.navigate(['/eventos']);
      }
    }
  }
}
