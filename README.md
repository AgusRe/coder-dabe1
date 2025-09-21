# Coderhouse - Desarrollo Backend I

## 📌 Proyecto Final

Este proyecto implementa un servidor backend en **Node.js con Express**, con persistencia principal en **MongoDB** usando **Mongoose**, motor de plantillas **Handlebars** y comunicación en tiempo real con **Socket.IO**.  
Forma parte de la entrega final del curso de **Desarrollo Backend Avanzado** en Coderhouse.

---

## 🚀 Tecnologías y Dependencias

- **Node.js + Express** → Servidor y enrutamiento.
- **MongoDB + Mongoose** → Persistencia principal de productos y carritos.
- **mongoose-paginate-v2** → Paginación, filtros y ordenamiento en productos.
- **Express-Handlebars** → Motor de plantillas para renderizar vistas.
- **Socket.IO** → Comunicación en tiempo real en `/realtimeproducts`.
- **Nodemon** → Desarrollo con recarga automática.
- **Bootstrap 5** → estilos y maquetado responsive.
- **Method-Override** → soporte para PUT y DELETE en formularios.

Instalación de dependencias:

```bash
npm install
```

Correr en modo desarrollo:

```bash
npm run dev
```

---

## 📂 Rutas principales

### Productos (`/api/products`)
- `GET /` → Listar productos (con filtros, paginación y ordenamiento).
- `GET /:pid` → Obtener un producto por ID.
- `POST /` → Crear producto.
- `PUT /:pid` → Actualizar producto.
- `DELETE /:pid` → Eliminar producto.

### Carritos (`/api/carts`)
- `POST /` → Crear carrito.
- `GET /:cid` → Obtener carrito con populate.
- `POST /:cid/products/:pid` → Agregar producto.
- `PUT /:cid/products/:pid` → Actualizar cantidad.
- `DELETE /:cid/products/:pid` → Eliminar producto específico.
- `PUT /:cid` → Reemplazar todos los productos.
- `DELETE /:cid` → Vaciar carrito.

### Vistas
- `/products` → Listado con paginación y agregar al carrito.
- `/products/:pid` → Detalle de producto.
- `/carts/:cid` → Vista de carrito con `+ / -`, eliminar y total dinámico.
- `/realtimeproducts` → Vista de productos en tiempo real.

---

## 🖥️ Vistas con Handlebars

### `/products`
Lista de productos con paginación y botones de “Agregar al carrito”.  

### `/products/:pid`
Vista detallada de un producto (nombre, descripción, precio, categoría) con botón para agregar al carrito.  

### `/carts/:cid`
Visualización de un carrito específico con todos sus productos.  

### `/realtimeproducts`
Lista de productos que se actualiza en tiempo real mediante **WebSockets**.  
Permite agregar y eliminar productos desde un formulario sin recargar la página.

---

## 📡 WebSockets (Socket.IO)

En la vista **`/realtimeproducts`**:
- Cada vez que se crea un producto → se actualiza automáticamente la lista en todas las pestañas abiertas.
- Cada vez que se elimina un producto → desaparece en tiempo real de todas las pestañas.

---

## 🔗 Endpoints para probar

- [http://localhost:8080/products](http://localhost:8080/products) → Productos.  
- [http://localhost:8080/carts](http://localhost:8080/carts) → Carrito.  
- [http://localhost:8080/realtimeproducts](http://localhost:8080/realtimeproducts) → Productos en tiempo real.

---
## 📝 Autor

Desarrollado por **Agustín Ré** como entrega final del curso *Desarrollo Avanzado de Backend* en **Coderhouse**.