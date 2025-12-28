# Aplicación de Gestión de Eventos y Actividades

## EVE (sí, como el pokemón, porque es lindi y porque puedo)

## Descripción

Aplicación móvil desarrollada con Ionic y Angular para la gestión de eventos y actividades personales y profesionales. La aplicación permite a los usuarios crear, editar, eliminar y gestionar sus eventos y actividades, con funcionalidades avanzadas de notificación, sincronización con calendarios externos y autenticación de usuarios.

## Características Principales

- **Gestión de Eventos**: Crear, editar y eliminar eventos con detalles como título, descripción, fecha, hora y ubicación
- **Gestión de Actividades**: Crear, editar y eliminar actividades con categorías, prioridades y estado de completitud
- **Notificaciones Push**: Sistema de recordatorios y notificaciones para eventos próximos
- **Sincronización con Calendarios**: Integración con Google Calendar, Outlook y Apple Calendar
- **Autenticación de Usuarios**: Registro e inicio de sesión con gestión de perfiles
- **Almacenamiento Local**: Funcionalidad offline con sincronización automática
- **Accesibilidad**: Soporte para usuarios con discapacidades
- **Seguridad**: Validación de entradas y protección contra XSS

## Tecnologías Utilizadas

- **Ionic Framework**: Para el desarrollo de la interfaz de usuario
- **Angular**: Framework principal para la lógica de la aplicación
- **TypeScript**: Lenguaje de programación
- **HTML/CSS**: Estructura y estilos
- **Node.js**: Entorno de ejecución
- **Capacitor**: Para funcionalidades nativas
- **Jasmine/Karma**: Para pruebas automatizadas
- **Google Calendar API**: Para integración con calendarios externos

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/Pauaua/ExamenFinalMobile.git

cd gestionEventos
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar la aplicación en modo desarrollo:
```bash
ionic serve
```

## Estructura del Proyecto

```
src/
├── app/
│   ├── home/                 # Página principal
│   ├── pages/
│   │   ├── eventos/          # Gestión de eventos
│   │   ├── actividades/      # Gestión de actividades
│   │   ├── event-create/     # Creación de eventos
│   │   ├── activity-create/  # Creación de actividades
│   │   ├── event-detail/     # Detalles de eventos
│   │   ├── activity-detail/  # Detalles de actividades
│   │   └── login/            # Autenticación
│   ├── profile/              # Perfil de usuario
│   ├── register/             # Registro de usuarios
│   └── services/             # Servicios de la aplicación
│       ├── auth.service.ts   # Autenticación
│       ├── eventos.ts        # Servicio de eventos
│       ├── activities.service.ts # Servicio de actividades
│       ├── notification.service.ts # Notificaciones
│       ├── sync.service.ts   # Sincronización
│       ├── calendar-integration.service.ts # Integración de calendarios
│       └── google-calendar.service.ts # API de Google Calendar
```

## Servicios Implementados

### 1. Servicio de Autenticación (`auth.service.ts`)
- Registro e inicio de sesión de usuarios
- Gestión de sesiones
- Preferencias de notificación por usuario

### 2. Servicio de Notificaciones (`notification.service.ts`)
- Programación de notificaciones para eventos y actividades
- Soporte para recordatorios personalizados
- Cancelación de notificaciones
- Soporte para navegadores con y sin API de notificaciones

### 3. Servicio de Sincronización (`sync.service.ts`)
- Almacenamiento local usando localStorage
- Detección de estado de conexión
- Sincronización automática cuando se restablece la conexión
- Cola de sincronización para operaciones offline

### 4. Servicio de Integración de Calendario (`calendar-integration.service.ts`)
- Sincronización con Google Calendar, Outlook Calendar y Apple Calendar
- Importación de eventos desde calendarios externos
- Soporte para múltiples tipos de calendario

### 5. Servicio de Google Calendar (`google-calendar.service.ts`)
- Autenticación OAuth con Google Calendar
- Obtención de eventos de calendarios
- Creación, actualización y eliminación de eventos
- Conversión entre formatos de evento

## Pruebas Implementadas

### 1. Pruebas de Notificaciones
- Pruebas para programar notificaciones de eventos
- Pruebas para programar notificaciones de actividades
- Pruebas para cancelar notificaciones
- Pruebas para mostrar notificaciones

### 2. Pruebas de Sincronización
- Pruebas para añadir elementos a la cola de sincronización
- Pruebas para obtener eventos locales
- Pruebas para obtener actividades locales
- Pruebas para verificar el estado de conexión

### 3. Pruebas de Seguridad
- Validación de fortaleza de contraseñas
- Prevención de secuestro de sesión con tokens seguros
- Validación de entrada para prevenir XSS
- Implementación de limitación de intentos para inicio de sesión
- Encriptación de datos sensibles en almacenamiento
- Validación de tokens JWT

## Accesibilidad

La aplicación incluye características de accesibilidad para usuarios con discapacidades:

- Atributos `aria-label` para describir elementos interactivos
- Implementación de `role` para estructurar el contenido
- Soporte para navegación por teclado
- Etiquetas adecuadas para lectores de pantalla

## API de Google Calendar

Para usar la integración con Google Calendar:

1. Crear un proyecto en Google Cloud Console
2. Habilitar la Google Calendar API
3. Crear credenciales OAuth 2.0
4. Configurar el CLIENT_ID en `google-calendar.service.ts`


## EXAMEN FINAL 
## DESARROLLO DE APLICACIONES MÓVILES 

Creado por Paulina Acuña Paiva `

## Uso IA

Documentación y corrección de errores. 