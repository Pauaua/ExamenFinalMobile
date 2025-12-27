import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { EventosService, Evento } from 'src/app/services/eventos';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.page.html',
  styleUrls: ['./event-detail.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, DatePipe]
})
export class EventDetailPage implements OnInit {
  evento: Evento | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventosService: EventosService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.evento = this.eventosService.getEventoById(id) || null;
    }
  }

  editarEvento() {
    if (this.evento) {
      // En una implementación completa, redirigiríamos a una página de edición
      // Por ahora, simplemente mostramos un mensaje
      this.router.navigate([`/event-create`]);
    }
  }

  async eliminarEvento() {
    if (this.evento) {
      const alert = await this.alertController.create({
        header: 'Confirmar eliminación',
        message: `¿Estás seguro de que deseas eliminar el evento "${this.evento.titulo}"?`,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel'
          },
          {
            text: 'Eliminar',
            handler: () => {
              this.eventosService.eliminarEvento(this.evento!.id);
              this.router.navigate(['/eventos']);
            }
          }
        ]
      });

      await alert.present();
    }
  }

  async sincronizarConCalendario() {
    const alert = await this.alertController.create({
      header: 'Sincronizando...',
      message: 'Sincronizando con calendario externo...'
    });

    await alert.present();

    // Simular la sincronización
    this.eventosService.sincronizarConCalendarioExterno().then(() => {
      alert.dismiss();
      this.presentSincronizacionAlert();
    });
  }

  async presentSincronizacionAlert() {
    const alert = await this.alertController.create({
      header: 'Sincronización completada',
      message: 'El evento ha sido sincronizado con tu calendario externo.',
      buttons: ['OK']
    });

    await alert.present();
  }
}
