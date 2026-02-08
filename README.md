# 📽️ Movix

Movix es una **aplicación móvil de películas** desarrollada con **Expo y React Native**, que permite explorar, buscar y guardar películas favoritas. Incluye autenticación con Google, manejo de favoritos y soporte multi‑idioma.

> 🚀 Proyecto cross‑platform (Android / iOS) enfocado en buenas prácticas de frontend móvil.

---

## 📌 Features

- 🎬 Listado de películas populares y trending  
- 🔍 Búsqueda de películas  
- ❤️ Guardar / remover películas favoritas (bookmarks)  
- 🔐 Login con Google (Appwrite OAuth)  
- 🌍 Selector de idioma (por defecto el del dispositivo)  
- 🎨 UI con NativeWind (Tailwind en React Native)  
- ⚡ Estado global con React Context y hooks

---

## 🛠️ Tecnologías

- **Expo**
- **React Native**
- **TypeScript**
- **Appwrite** (Auth + DB)
- **NativeWind**
- **Expo Router**

---

## 🚀 Instalación

Clonar el repositorio:

```bash
git clone https://github.com/gastoncuesta/movix.git
cd movix
```

Instalar dependencias:

```bash
npm install
```

Ejecutar en desarrollo:

```bash
npx expo start
```

---

## ⚙️ Variables de entorno

Crear un archivo `.env` con las siguientes variables:

```env
APPWRITE_ENDPOINT=https://your-appwrite-endpoint
APPWRITE_PROJECT_ID=your_project_id
```

(Si usás una API externa de películas, agregá la key correspondiente.)

---

## 📁 Estructura del proyecto

```text
movix/
├── app/            # Screens y routing
├── components/     # Componentes reutilizables
├── services/       # Appwrite y APIs
├── constants/      # Icons, images, config
├── assets/         # Assets estáticos
├── app.json
└── README.md
```

---

## 📱 Uso

1. Abrí la app en Expo Go o emulador  
2. Logueate con Google  
3. Explorá y buscá películas  
4. Guardá tus favoritas  
5. Cambiá el idioma desde el selector

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas:

1. Fork del repo  
2. Crear una branch (`feature/nueva-feature`)  
3. Commit de cambios  
4. Pull Request

---

## 📜 Licencia

MIT License © Gaston Cuesta
