import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import path from "path";
import http from "http";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

import productsRouter from "./routers/products.router.js";
import cartsRouter from "./routers/carts.router.js";
import viewsRouter from "./routers/views.router.js";
import { productModel } from "./models/Product.model.js";
import clientRouter from "./routers/client.router.js";

// Constantes para ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// App y servidor
const app = express();
const servidorHttp = http.createServer(app);
const io = new Server(servidorHttp);
const PORT = 8080;

// Conexión a MongoDB
const MONGO_URI = "mongodb+srv://Agustin:dbexamples123@cluster0.7a2muft.mongodb.net/coderhouse?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error al conectar a MongoDB:", err));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Routers
app.use("/products", productsRouter);
app.use("/carts", cartsRouter);
app.use("/", viewsRouter);

// Redirigir raíz a productos
app.get("/", (req, res) => {
  res.redirect("/products");
});

// Clientes
app.use("/clients", clientRouter);

// WebSockets
io.on("connection", async (socket) => {
  console.log("Cliente conectado:", socket.id);

  // enviar productos iniciales
  const productos = await productModel.find().lean();
  socket.emit("updateProducts", productos);

  // escucha creacion de producto
  socket.on("newProduct", async (data) => {
    await productModel.create(data);
    const productos = await productModel.find().lean();
    io.emit("updateProducts", productos);
  });

  // escucha eliminacion de producto
  socket.on("deleteProduct", async (id) => {
    await productModel.findByIdAndDelete(id);
    const productos = await productModel.find().lean();
    io.emit("updateProducts", productos);
  });
});

// Levantar el servidor
servidorHttp.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});