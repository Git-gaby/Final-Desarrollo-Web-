# Evaluación Final - Desarrollo Web: Gestión de Reseñas de Restaurantes

Aplicación web Full Stack desarrollada para la asignatura **Desarrollo Web** (Ingeniería Informática - Corporación Universitaria Unilasallista), orientada por el docente **Néstor Vélez Vargas**.

El sistema permite a los usuarios registrarse, iniciar sesión mediante autenticación basada en **JWT** almacenado estrictamente en **`sessionStorage`** y gestionar (crear, consultar, editar y eliminar) **únicamente sus propias reseñas de restaurantes**, garantizando el aislamiento total de la información entre diferentes usuarios.

---

## Autores

* **Gabriel Jaime Gómez Restrepo**
* **Jerónimo Arboleda Galeano**
* **Cristian Duque Lenis**

---

## Stack Tecnológico

* **Frontend:** Angular (Standalone Components, Reactive Forms, HTTP Interceptors, Route Guards, `sessionStorage`).
* **Backend:** Node.js + Express (API RESTful, autenticación con `jsonwebtoken` y cifrado de contraseñas con `bcryptjs`).
* **Base de Datos:** MySQL / MariaDB (gestionada mediante phpMyAdmin).

---

## Estructura del Repositorio

```text
final-desarrollo-web/
├── .gitignore
├── README.md
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middlewares/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── resenas.routes.js
│   ├── index.js
│   └── package.json
└── frontend/
    ├── public/
    ├── src/
    │   └── app/
    │       ├── components/
    │       │   ├── login/
    │       │   └── resenas/
    │       ├── guards/
    │       ├── interceptors/
    │       ├── services/
    │       ├── app.config.ts
    │       └── app.routes.ts
    ├── angular.json
    └── package.json
```

---

## Requisitos Previos

* **Node.js** (v20 o superior)
* **XAMPP** (servicios **Apache** y **MySQL / MariaDB** activos)
* **Angular CLI** (`npm install -g @angular/cli`)

---

## Guía de Instalación y Ejecución

### 1. Configuración de la Base de Datos (MariaDB / MySQL)

1. Inicia los módulos **Apache** y **MySQL** desde el panel de control de XAMPP.
2. Ingresa a **phpMyAdmin** (`http://localhost/phpmyadmin`).
3. Dirígete a la pestaña **SQL** y ejecuta el siguiente script para crear la base de datos y las tablas con sus respectivas llaves foráneas:

```sql
CREATE DATABASE IF NOT EXISTS resenas_restaurantes 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE resenas_restaurantes;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE resenas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_restaurante VARCHAR(150) NOT NULL,
    calificacion TINYINT NOT NULL,
    fecha_visita DATE NOT NULL,
    observaciones TEXT,
    usuario_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_resena_usuario 
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) 
        ON DELETE CASCADE
) ENGINE=InnoDB;
```

---

### 2. Configuración y Arranque del Backend

1. Abre una terminal y ubícate en la carpeta `backend`:
   ```bash
   cd backend
   ```
2. Instala las dependencias del proyecto:
   ```bash
   npm install
   ```
3. Crea un archivo `.env` en la raíz de `backend/` con las siguientes variables de entorno:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=resenas_restaurantes
   JWT_SECRET=clave_secreta_super_segura_unilasallista_2026
   ```
   *(Ajusta `DB_PASSWORD` si tu instancia local de MySQL tiene contraseña).*
4. Inicia el servidor:
   ```bash
   node index.js
   ```
   El servidor quedará escuchando en `http://localhost:3000`.

---

### 3. Configuración y Arranque del Frontend

1. Abre una segunda terminal y ubícate en la carpeta `frontend`:
   ```bash
   cd frontend
   ```
2. Instala las dependencias de Angular:
   ```bash
   npm install
   ```
3. Ejecuta el servidor de desarrollo:
   ```bash
   ng serve
   ```
4. Abre tu navegador en `http://localhost:4200`.

---

## Endpoints Principales de la API

### Autenticación (`/api/auth`)
* `POST /api/auth/register` — Registro de un nuevo usuario (`nombre`, `email`, `password`).
* `POST /api/auth/login` — Inicio de sesión y generación del token JWT.

### Reseñas de Restaurantes (`/api/resenas`) — *Requiere cabecera `Authorization: Bearer <token>`*
* `GET /api/resenas` — Lista únicamente las reseñas pertenecientes al usuario autenticado.
* `POST /api/resenas` — Crea una nueva reseña asociada al `usuario_id` extraído del token.
* `PUT /api/resenas/:id` — Actualiza una reseña verificando que pertenezca al usuario autenticado.
* `DELETE /api/resenas/:id` — Elimina una reseña verificando que pertenezca al usuario autenticado.