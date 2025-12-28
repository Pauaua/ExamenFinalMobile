import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ActivitiesService, Activity } from 'src/app/services/activities.service';

@Component({
  selector: 'app-actividades',
  templateUrl: './actividades.page.html',
  styleUrls: ['./actividades.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, DatePipe, RouterLink]
})
export class ActividadesPage implements OnInit {
  activities: Activity[] = [];

  constructor(
    private activitiesService: ActivitiesService,
    private router: Router
  ) { }

  ngOnInit() {
    this.cargarActivities();
  }

  ionViewDidEnter() {
    this.cargarActivities();
  }

  cargarActivities() {
    this.activities = this.activitiesService.getActivities();
  }

  crearActivity() {
    this.router.navigate(['/activity-create']);
  }

  doRefresh(event: any) {
    setTimeout(() => {
      this.cargarActivities();
      event.target.complete();
    }, 1000);
  }
}
