# Nexum Panel

Frontend del sistema **Nexum**, construido con **Angular 22**, **PrimeNG 21** y **PrimeFlex**.

---

## Tecnologías

* Angular 22 (Standalone Components)
* PrimeNG 21 + PrimeIcons
* PrimeFlex
* @primeuix/themes (Tema Aura)
* Reactive Forms
* Angular Signals

---

## Requisitos

* Node.js 22+
* Angular CLI 22

```bash
npm install -g @angular/cli
```

---

## Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/nexum-panel.git
cd nexum-panel
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar el backend

Editar el archivo:

```text
src/environments/environment.ts
```

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7000'
};
```

### 4. Iniciar el servidor de desarrollo

```bash
ng serve
```

La aplicación estará disponible en:

```text
http://localhost:4200
```

---

## Estructura del proyecto

```text
src/
└── app/
    ├── core/
    │   ├── authorization/
    │   │   ├── permissions.enum.ts
    │   │   ├── permissions.catalog.ts
    │   │   └── has-permission.directive.ts
    │   ├── guards/
    │   │   ├── auth.guard.ts
    │   │   └── permission.guard.ts
    │   ├── interceptors/
    │   │   ├── auth-interceptor.ts
    │   │   └── error-interceptor.ts
    │   └── services/
    │       ├── auth.service.ts
    │       ├── storage.service.ts
    │       ├── role.service.ts
    │       └── user.service.ts
    │
    ├── features/
    │   ├── auth/
    │   │   ├── login/
    │   │   ├── forgot-password/
    │   │   └── reset-password/
    │   │
    │   ├── users/
    │   │   ├── users-list/
    │   │   └── users-form/
    │   │
    │   └── roles/
    │       ├── roles-list/
    │       └── roles-form/
    │
    └── app.routes.ts
```

### Descripción de carpetas

| Ruta                 | Descripción                                      |
| -------------------- | ------------------------------------------------ |
| `core/authorization` | Sistema de permisos y directivas de autorización |
| `core/guards`        | Protección de rutas                              |
| `core/interceptors`  | Manejo global de peticiones HTTP                 |
| `core/services`      | Servicios compartidos                            |
| `features/auth`      | Autenticación y recuperación de contraseña       |
| `features/users`     | Gestión de usuarios                              |
| `features/roles`     | Gestión de roles y permisos                      |

---

## Funcionalidades implementadas

### Autenticación

* Inicio de sesión mediante usuario y contraseña.
* Recuperación de contraseña por correo electrónico.
* Restablecimiento de contraseña mediante token.
* Renovación automática de tokens mediante interceptor.

### Usuarios

* Listado paginado con búsqueda.
* Creación de usuarios.
* Edición de información y estado.
* Eliminación con confirmación.
* Control de acceso basado en permisos.

### Roles

* Listado paginado con búsqueda.
* Creación de roles.
* Asignación y edición de permisos.
* Eliminación con confirmación.
* Control de acceso basado en permisos.

---

## Sistema de permisos

Los permisos son enviados por el backend dentro del objeto `AuthResponse` durante el inicio de sesión y se almacenan en la sesión del usuario.

### Uso en componentes

```typescript
import { Permission } from '../../../core/authorization/permissions.enum';

export class UsersListComponent {
  Permission = Permission;
}
```

### Mostrar u ocultar elementos

```html
<p-button
  *hasPermission="Permission.CanCreateUsers"
  label="Nuevo usuario">
</p-button>
```

### Protección de rutas

```typescript
import { permissionGuard } from '../../core/guards/permission.guard';

{
  path: 'users',
  canActivate: [
    permissionGuard(Permission.CanViewUsers)
  ],
  loadComponent: () =>
    import('./users/users-list/users-list')
      .then(m => m.UsersList)
}
```

### Validación desde TypeScript

```typescript
private auth = inject(AuthService);

if (this.auth.hasPermission(Permission.CanEditUsers)) {
  // lógica protegida
}
```

---

## Tema y estilos

El proyecto utiliza el tema **Aura** de PrimeNG con color principal **Indigo**.

El modo oscuro puede activarse estableciendo el atributo:

```html
data-theme="dark"
```

Las variables globales se encuentran definidas en:

```text
src/styles.scss
```

### Variables CSS

| Variable           | Descripción                 |
| ------------------ | --------------------------- |
| `--accent`         | Color principal (`#6366f1`) |
| `--text-primary`   | Texto principal             |
| `--text-secondary` | Texto secundario            |
| `--bg-primary`     | Fondo principal             |
| `--bg-secondary`   | Fondo de tarjetas y sidebar |
| `--danger`         | Color de error (`#ef4444`)  |

---

## Scripts disponibles

```bash
# Desarrollo
ng serve

# Build producción
ng build

# Ejecutar pruebas
ng test

# Verificar linting
ng lint
```

---

## Licencia

Proyecto interno de Nexum.
