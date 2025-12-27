import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(
    private eventosService: EventosService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  crearEvento() {
    if (this.nuevoEvento.titulo && this.nuevoEvento.fecha) {
      this.eventosService.crearEvento(this.nuevoEvento as Omit<Evento, 'id'>);
      this.router.navigate(['/eventos']);
    }
  }
}
