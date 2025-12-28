import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivitiesService, Activity } from 'src/app/services/activities.service';

@Component({
  selector: 'app-activity-create',
  templateUrl: './activity-create.page.html',
  styleUrls: ['./activity-create.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ActivityCreatePage implements OnInit {
  nuevaActivity: Partial<Activity> = {
    titulo: '',
    descripcion: '',
    fecha: new Date(),
    hora: '09:00',
    ubicacion: '',
    tipo: 'personal',
    completada: false,
    prioridad: 'media'
  };
  esEdicion = false;
  activityId: string | null = null;

  constructor(
    private activitiesService: ActivitiesService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.activityId = id;
        this.esEdicion = true;
        const activity = this.activitiesService.getActivityById(id);
        if (activity) {
          this.nuevaActivity = { ...activity };
        }
      }
    });
  }

  guardarActivity() {
    if (this.nuevaActivity.titulo && this.nuevaActivity.fecha) {
      if (this.esEdicion && this.activityId) {
        // Actualizar actividad existente
        this.activitiesService.actualizarActivity(this.activityId, this.nuevaActivity as Partial<Activity>);
        this.router.navigate(['/actividades']);
      } else {
        // Crear nueva actividad
        this.activitiesService.crearActivity(this.nuevaActivity as Omit<Activity, 'id' | 'userId'>);
        this.router.navigate(['/actividades']);
      }
    }
  }
}
