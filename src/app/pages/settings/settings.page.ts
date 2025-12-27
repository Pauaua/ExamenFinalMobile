import { Component, OnInit } from '@angular/core';
import { AlertController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Configuracion {
  accesibilidad: {
    altoContraste: boolean;
    fuenteGrande: boolean;
    lectorPantalla: boolean;
    descripcionImagenes: boolean;
  };
  notificaciones: {
    pushHabilitadas: boolean;
    recordatorioDefault: number;
  };
  calendario: {
    sincronizacionAutomatica: boolean;
    aplicacionDefault: string;
  };
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SettingsPage implements OnInit {
  configuracion: Configuracion = {
    accesibilidad: {
      altoContraste: false,
      fuenteGrande: false,
      lectorPantalla: false,
      descripcionImagenes: false
    },
    notificaciones: {
      pushHabilitadas: true,
      recordatorioDefault: 15
    },
    calendario: {
      sincronizacionAutomatica: true,
      aplicacionDefault: 'local'
    }
  };

  constructor(private alertController: AlertController) { }

  ngOnInit() {
    this.cargarConfiguracion();
  }

  cargarConfiguracion() {
    // En una implementación completa, cargaríamos la configuración desde el almacenamiento
    // Por ahora, usamos los valores predeterminados
  }

  async guardarConfiguracion() {
    // En una implementación completa, guardaríamos la configuración en el almacenamiento
    const alert = await this.alertController.create({
      header: 'Configuración guardada',
      message: 'La configuración ha sido guardada exitosamente.',
      buttons: ['OK']
    });

    await alert.present();
  }
}
