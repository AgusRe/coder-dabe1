# Curso de Programación Backend I: Desarrollo Avanzado de Backend

**Desarrollo Avanzado de Backend 1**

---

## Dependencias

- **express** (`^5.1.0`): Framework web para crear el servidor y las rutas HTTP.  
- **nodemon** (`^3.1.10`): Reinicio automático del servidor durante el desarrollo.  
- **express-handlebars**: Motor de plantillas para renderizar vistas.  
- **socket.io**: Comunicación en tiempo real entre servidor y cliente.

---

## Scripts

- `npm run dev`  
  Inicia el servidor en modo desarrollo con nodemon:
  ```bash
  npm install
  npm run dev
  ```

---

## Estructura de rutas

### API de Productos (`/api/products`)

- `GET /` – Listar todos los productos  
- `GET /:pid` – Obtener un producto por ID  
- `POST /` – Crear un producto  
- `PUT /:pid` – Actualizar un producto  
- `DELETE /:pid` – Eliminar un producto  

### API de Carritos (`/api/carts`)

- `POST /` – Crear un carrito nuevo  
- `GET /:cid` – Listar productos de un carrito  
- `POST /:cid/product/:pid` – Agregar un producto al carrito  

---

## Vistas con Handlebars

- **Home (`/`)**  
  Muestra un listado de todos los productos (renderizado vía HTTP).  

- **Real Time Products (`/realtimeproducts`)**  
  Muestra la lista de productos y se actualiza automáticamente gracias a **WebSockets**:
  - Al crear un producto con el formulario, se emite un evento al servidor y todos los clientes conectados actualizan la lista.
  - Al eliminar un producto, también se actualiza en tiempo real.

---

## Cómo probar la aplicación

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Iniciar el servidor:
   ```bash
   npm run dev
   ```

3. Probar API REST con **Postman** en:
   - `http://localhost:8080/api/products`
   - `http://localhost:8080/api/carts`

4. Probar vistas en el navegador:
   - `http://localhost:8080/` → listado de productos (HTTP).  
   - `http://localhost:8080/realtimeproducts` → listado en tiempo real (WebSockets).  

5. En **/realtimeproducts**:
   - Usar el formulario para **agregar productos**.
   - Usar el formulario para **eliminar productos** por ID.
   - Ver cómo la lista se actualiza automáticamente en todos los navegadores abiertos.

---

## Autor

Agustín Ré