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



## Licencia

Proyecto interno de Nexum.
