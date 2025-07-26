# Curso de Programación Backend I: Desarrollo Avanzado de Backend

**Desarrollo Avanzado de Backend 1**

---

## Dependencias

- **express** (`^5.1.0`): Framework web para crear el servidor y las rutas HTTP.  
- **nodemon** (`^3.1.10`): Reinicio automático del servidor durante el desarrollo.

---

## Scripts

- `npm run dev`  
  Inicia el servidor en modo desarrollo con nodemon:
  ```bash
  npm install
  npm run dev

## Estructura de rutas

### Productos (`/api/products`)

- `GET /` – Listar todos los productos  
- `GET /:pid` – Obtener un producto por ID  
- `POST /` – Crear un producto  
- `PUT /:pid` – Actualizar un producto  
- `DELETE /:pid` – Eliminar un producto  

### Carritos (`/api/carts`)

- `POST /` – Crear un carrito nuevo  
- `GET /:cid` – Listar productos de un carrito  
- `POST /:cid/product/:pid` – Agregar un producto al carrito  
