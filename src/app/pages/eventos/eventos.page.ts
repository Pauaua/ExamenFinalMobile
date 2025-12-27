import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { EventosService, Evento } from 'src/app/services/eventos';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.page.html',
  styleUrls: ['./eventos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, DatePipe, RouterLink]
})
export class EventosPage implements OnInit {
  eventos: Evento[] = [];

  constructor(
    private eventosService: EventosService,
    private router: Router
  ) { }

  ngOnInit() {
    this.cargarEventos();
  }

  ionViewDidEnter() {
    this.cargarEventos();
  }

  cargarEventos() {
    this.eventos = this.eventosService.getEventos();
  }

  crearEvento() {
    this.router.navigate(['/event-create']);
  }

  doRefresh(event: any) {
    setTimeout(() => {
      this.cargarEventos();
      event.target.complete();
    }, 1000);
  }
}
