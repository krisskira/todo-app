# Prueba Coally

## Requisitos Previos
- Docker (Opcional), para generar la app en producción o hacer pruebas del build
- Node.js (versión 22)
- NPM (Node Package Manager)
- MongoDB (Puede usar Docker usando la configuracion en `.infra`, o configurar la conexión de base de datos)
- SMTP Server

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/crhistian/todo-app.git
```

2. Entrar al directorio del proyecto:
```bash
cd todo-app
```

3. Instalar las dependencias:
```bash
npm install
```

4. Variables de entorno API:
```bash
cd apps/api
cp .env.example .env
nano .env
```
### Contennido de .env
```bash
PORT=3000
NODE_ENV=development
HOST=http://localhost

DATABASE_URL=
DATABASE_NAME=

JWT_SECRET=secret
JWT_EXPIRES_IN=7d

MAIL_HOST=smtp.gmail.com
MAIL_PORT=465
MAIL_USER=john.doe@gmail.com
MAIL_PASS='xxxx xxxx xxxx xxxx'
```

### Configuración MongoDB usando Docker

- Una ves levante una instancia de MongoDB usando Docker, puede usar la cadena de conexiones de base de datos que se encuentra en el archivo `.env` o crear una nueva conexión.

```bash
cd .infra
docker-compose -f docker-compose.infra.yml up -d
```

### Configuración SMTP 
 - Crear una cuenta de correo electrónico en Gmail
 - Configurar el servidor de correo electrónico SMTP
 - Configurar las credenciales de acceso SMTP


5. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

6. Abrir la aplicación en el navegador:
```bash
APP: http://localhost:3000
Swagger docs: http://localhost:3000/api-docs/
```

7. Generar una imagen Docker del proyecto:


Puede generar la imagen Docker del proyecto ejecutando el siguiente comando:

```bash
npm run docker:build
```

Siga las instrucciones generales para subir la imagen Docker a registers de contenedores.


