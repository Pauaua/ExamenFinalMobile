import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonicModule, ActionSheetController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ActivitiesService, Activity } from 'src/app/services/activities.service';
import { CalendarIntegrationService } from 'src/app/services/calendar-integration.service';

@Component({
  selector: 'app-activity-detail',
  templateUrl: './activity-detail.page.html',
  styleUrls: ['./activity-detail.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, DatePipe, RouterLink]
})
export class ActivityDetailPage implements OnInit {
  activity: Activity | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private activitiesService: ActivitiesService,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController,
    private calendarIntegrationService: CalendarIntegrationService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.activity = this.activitiesService.getActivityById(id) || null;
    }
  }

  editarActivity() {
    if (this.activity) {
      this.router.navigate([`/activity-create/${this.activity.id}`]);
    }
  }

  async eliminarActivity() {
    if (this.activity) {
      const alert = await this.alertController.create({
        header: 'Confirmar eliminación',
        message: `¿Estás seguro de que deseas eliminar la actividad "${this.activity.titulo}"?`,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel'
          },
          {
            text: 'Eliminar',
            handler: () => {
              this.activitiesService.eliminarActivity(this.activity!.id);
              this.router.navigate(['/actividades']);
            }
          }
        ]
      });

      await alert.present();
    }
  }

  async mostrarOpcionesCalendario() {
    if (!this.activity) return;

    const actionSheet = await this.actionSheetController.create({
      header: 'Sincronizar con Calendario',
      buttons: [
        {
          text: 'Google Calendar',
          icon: 'calendar',
          handler: () => {
            this.sincronizarConCalendario('google');
          }
        },
        {
          text: 'Outlook Calendar',
          icon: 'calendar',
          handler: () => {
            this.sincronizarConCalendario('outlook');
          }
        },
        {
          text: 'Apple Calendar',
          icon: 'calendar',
          handler: () => {
            this.sincronizarConCalendario('apple');
          }
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  async sincronizarConCalendario(calendarType: 'google' | 'outlook' | 'apple') {
    if (!this.activity) return;

    const alert = await this.alertController.create({
      header: 'Sincronizando...',
      message: `Sincronizando con ${calendarType} Calendar...`
    });

    await alert.present();

    // Sincronizar con el calendario seleccionado
    const success = await this.calendarIntegrationService.syncActivityToCalendar(this.activity, calendarType);

    alert.dismiss();

    if (success) {
      const successAlert = await this.alertController.create({
        header: 'Sincronización completada',
        message: `La actividad ha sido sincronizada con ${calendarType} Calendar.`,
        buttons: ['OK']
      });
      await successAlert.present();
    } else {
      const errorAlert = await this.alertController.create({
        header: 'Error de sincronización',
        message: `No se pudo sincronizar la actividad con ${calendarType} Calendar.`,
        buttons: ['OK']
      });
      await errorAlert.present();
    }
  }
}
