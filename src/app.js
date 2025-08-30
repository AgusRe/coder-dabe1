import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import path from "path";
import http from "http";
import { fileURLToPath } from "url";

import productsRouter from "./routers/products.router.js";
import cartsRouter from "./routers/carts.router.js";
import viewsRouter from "./routers/views.router.js";
import ProductManager from "./managers/ProductManager.js";

// Constantes para ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const servidorHttp = http.createServer(app);
const io = new Server(servidorHttp);

// ProductManager para sockets
const pm = new ProductManager(path.join(__dirname, "data", "products.json"));
const PORT = 8080;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/socket.io', express.static(path.join(__dirname, '..', 'node_modules', 'socket.io', 'client-dist')));
app.use(express.static(path.join(__dirname, "public")));

// Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Routers
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter); // ref a home y realtimeproducts

// Servidor HTTP + Socket.io
servidorHttp.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});

io.on("connection", async (socket) => {
  console.log("Cliente conectado:", socket.id);

  // enviar productos al conectar
  socket.emit("updateProducts", await pm.getProducts());

  // escucha creacion de producto
  socket.on("newProduct", async (data) => {
    await pm.addProduct(data);
    io.emit("updateProducts", await pm.getProducts()); // actualiza a todos
  });

  // escucha eliminacion de producto
  socket.on("deleteProduct", async (id) => {
    await pm.deleteProduct(Number(id));
    io.emit("updateProducts", await pm.getProducts());
  });
});