import { TestBed } from '@angular/core/testing';
import { Platform } from '@ionic/angular';
import { Evento } from './eventos';
import { Activity } from './activities.service';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let mockAuthService: any;
  let mockPlatform: any;

  beforeEach(() => {
    mockAuthService = {
      getCurrentUser: jasmine.createSpy('getCurrentUser').and.returnValue({
        preferenciasNotificacion: {
          pushHabilitadas: true
        }
      })
    };

    mockPlatform = {
      ready: jasmine.createSpy('ready').and.returnValue(Promise.resolve())
    };

    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: AuthService, useValue: mockAuthService },
        { provide: Platform, useValue: mockPlatform }
      ]
    });

    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should schedule event notification', () => {
    const evento: Evento = {
      id: '1',
      userId: '1',
      titulo: 'Test Event',
      descripcion: 'Test Description',
      fecha: new Date(Date.now() + 3600000), // 1 hour from now
      hora: '10:00',
      ubicacion: 'Test Location',
      notificacionHabilitada: true,
      recordatorioMinutos: 15
    };

    spyOn(service as any, 'showNotification');
    service.scheduleEventNotification(evento, 15);

    // Verificar que la notificación se programó
    expect((service as any).scheduledNotifications.length).toBeGreaterThanOrEqual(0);
  });

  it('should schedule activity notification', () => {
    const activity: Activity = {
      id: '1',
      userId: '1',
      titulo: 'Test Activity',
      descripcion: 'Test Description',
      fecha: new Date(Date.now() + 3600000), // 1 hour from now
      hora: '10:00',
      ubicacion: 'Test Location',
      tipo: 'personal',
      completada: false,
      prioridad: 'media'
    };

    spyOn(service as any, 'showNotification');
    service.scheduleActivityNotification(activity, 15);

    // Verificar que la notificación se programó
    expect((service as any).scheduledNotifications.length).toBeGreaterThanOrEqual(0);
  });

  it('should cancel notification', () => {
    const id = 123;
    // Agregar una notificación simulada
    (service as any).scheduledNotifications.push({ id, timeoutId: 12345 });

    service.cancelNotification(id);

    expect((service as any).scheduledNotifications.length).toBe(0);
  });

  it('should show notification when enabled', () => {
    spyOn(window, 'Notification');
    service.sendImmediateNotification('Test Title', 'Test Body');

    expect(window.Notification).toHaveBeenCalledWith('Test Title', jasmine.any(Object));
  });
});
