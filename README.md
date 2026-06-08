# Nexum Panel

Frontend del sistema Nexum, construido con **Angular 22**, **PrimeNG 21** y **PrimeFlex**.

---

## Tecnologías

- Angular 22 (Standalone Components)
- PrimeNG 21 + PrimeIcons
- PrimeFlex (utilidades CSS)
- @primeuix/themes (tema Aura)
- Reactive Forms
- Angular Signals

---

## Requisitos

- [Node.js 22+](https://nodejs.org)
- Angular CLI 22

```bash
npm install -g @angular/cli
```

---

## Configuración

1. Cloná el repositorio:
```bash
   git clone https://github.com/tu-usuario/nexum-panel.git
   cd nexum-panel
```

2. Instalá las dependencias:
```bash
   npm install
```

3. Configurá la URL del backend en `src/environments/environment.ts`:
```typescript
   export const environment = {
     production: false,
     apiUrl: 'https://localhost:7000'
   };
```

4. Levantá el servidor de desarrollo:
```bash
   npx ng serve
```

La aplicación estará disponible en `http://localhost:4200`.

---

## Estructura del proyecto