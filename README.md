# Spanish IA Tutor 🗣️🤖

Un asistente de inteligencia artificial conversacional para practicar español de manera natural e interactiva a través de conversaciones por voz.

## 🌟 Descripción del Proyecto

Spanish IA Tutor es una plataforma innovadora que combina inteligencia artificial con tecnología de reconocimiento y síntesis de voz para ofrecer una experiencia de aprendizaje de español inmersiva y personalizada. El sistema simula conversaciones naturales donde el agente IA propone temas de conversación y mantiene diálogos fluidos, permitiendo a los usuarios practicar sus habilidades de conversación en español de manera realista.

### Características Principales

- 🎤 **Conversaciones por Voz**: Interacción completamente oral simulando llamadas telefónicas reales
- 🧠 **IA Conversacional**: Agente inteligente que propone temas y mantiene conversaciones naturales
- 📚 **Temas Variados**: Amplia gama de temas de conversación adaptados al nivel del usuario
- 🔄 **Flujo Automatizado**: Integración con n8n para gestión de workflows conversacionales
- 👤 **Experiencia Personalizada**: Adaptación del contenido según el progreso del usuario
- 📱 **Interfaz Moderna**: Frontend responsivo desarrollado en React

## 🏗️ Arquitectura del Sistema

El proyecto utiliza una arquitectura de microservicios moderna:

- **Frontend**: React con interfaz de usuario intuitiva
- **Backend**: Node.js/Express para APIs REST y lógica de negocio
- **Base de Datos**: MySQL para almacenamiento de usuarios y sesiones
- **Automatización**: n8n para orquestación de workflows de IA
- **IA y Voz**: Integración con servicios de LLM y TTS/STT

## 📁 Estructura del Proyecto

```
/spanish-ia-tutor
├── /backend
│   ├── /src
│   │   ├── /controllers   # Controladores de API (auth, conversation)
│   │   ├── /database      # Modelos y conexión a MySQL
│   │   ├── /routes        # Definición de rutas REST
│   │   ├── server.js      # Servidor principal Express
│   │   └── n8nService.js  # Integración con webhooks n8n
│   ├── .env               # Variables de entorno
│   ├── package.json       # Dependencias Node.js
│   └── Dockerfile         # Contenedor Docker (opcional)
├── /frontend
│   ├── /public            # Archivos estáticos
│   ├── /src
│   │   ├── /components    # Componentes reutilizables
│   │   ├── /pages         # Páginas principales
│   │   ├── /utils         # Utilidades (audio, API)
│   │   ├── App.js         # Componente raíz
│   │   └── index.js       # Punto de entrada
│   ├── .env               # Configuración frontend
│   └── package.json       # Dependencias React
├── /n8n
│   ├── /workflows         # Workflows de automatización
│   ├── /data              # Datos internos n8n
│   └── .env               # Configuración n8n
├── .gitignore
└── README.md
```

## 🚀 Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **MySQL** - Base de datos relacional
- **JWT** - Autenticación
- **Multer** - Manejo de archivos de audio

### Frontend
- **React** - Librería de UI
- **Web Audio API** - Grabación y reproducción de audio
- **Axios** - Cliente HTTP
- **Material-UI / Tailwind CSS** - Estilizado

### Automatización e IA
- **n8n** - Plataforma de automatización
- **OpenAI GPT** - Modelo de lenguaje
- **Speech-to-Text** - Reconocimiento de voz
- **Text-to-Speech** - Síntesis de voz

## 📋 Prerequisitos

- Node.js (v16 o superior)
- MySQL (v8.0 o superior)
- n8n (instalación local o cloud)
- Claves de API para servicios de IA (OpenAI, etc.)

## 🛠️ Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone https://github.com/jmartin516/Spanish.prctice.bot.git
cd spanish-ia-tutor
```

### 2. Configurar Backend
```bash
cd backend
npm install
cp .env.example .env
# Configurar variables de entorno en .env
npm run dev
```

### 3. Configurar Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Configurar URL del backend
npm start
```

### 4. Configurar Base de Datos
```bash
# Crear base de datos MySQL
mysql -u root -p
CREATE DATABASE spanish_tutor;
# Ejecutar migraciones (cuando estén disponibles)
```

### 5. Configurar n8n
```bash
cd n8n
# Importar workflows desde /workflows
# Configurar credenciales de API en n8n
```

## 🎯 Uso del Sistema

1. **Registro/Login**: Los usuarios se registran y acceden al sistema
2. **Selección de Tema**: El sistema propone temas de conversación
3. **Conversación por Voz**: Interacción natural usando micrófono y altavoces
4. **Feedback IA**: El agente proporciona retroalimentación y continúa la conversación
5. **Progreso**: Seguimiento del progreso y mejoras en el tiempo

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Contacto

Juan Martin - [@jmartin516](https://github.com/jmartin516)

Link del Proyecto: [https://github.com/jmartin516/Spanish.prctice.bot](https://github.com/jmartin516/Spanish.prctice.bot)

---

⭐ Si este proyecto te ayuda, ¡dale una estrella en GitHub!
