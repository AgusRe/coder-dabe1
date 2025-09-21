import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import path from "path";
import http from "http";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import methodOverride from "method-override";

import productsRouter from "./routers/products.router.js";
import cartsRouter from "./routers/carts.router.js";
import viewsRouter from "./routers/views.router.js";
import Product from "./models/Product.model.js";
import clientRouter from "./routers/client.router.js";

// Constantes para ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// App y servidor
const app = express();
const servidorHttp = http.createServer(app);
const io = new Server(servidorHttp);
const PORT = process.env.PORT || 8080;

// Conexión a MongoDB
const MONGO_URI = "mongodb+srv://Agustin:dbexamples123@cluster0.7a2muft.mongodb.net/coderhouse?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error al conectar a MongoDB:", err));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Handlebars
app.use(methodOverride("_method"));
app.engine("handlebars",engine({
    helpers: {
      multiply: (a, b) => a * b,
      totalCart: (products) => {
        if (!products || products.length === 0) return 0;
        return products.reduce((sum, item) => {
          return sum + item.product.price * item.quantity;
        }, 0);
      },
      eq: (a, b) => a === b,
      neq: (a, b) => a !== b,
      inc: (a, b) => Number(a) + Number(b)
    },
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Routers
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

// Redirigir raíz a productos
app.get("/", (req, res) => res.redirect("/products"));

// Clientes
app.use("/api/clients", clientRouter);

// WebSockets
io.on("connection", async (socket) => {
  console.log("Cliente conectado:", socket.id);

  // enviar productos iniciales
  const productos = await Product.find().lean();
  socket.emit("updateProducts", productos);

  // escucha creacion de producto
  socket.on("newProduct", async (data, ack) => {
    try {
      await Product.create(data);
      const list = await Product.find().lean();
      io.emit("updateProducts", list);
      if (ack) ack({ status: "success" });
    } catch (err) {
      if (ack) ack({ status: "error", error: err.message });
    }
  });

  // escucha eliminacion de producto
  socket.on("deleteProduct", async (id, ack) => {
    try {
      await Product.findByIdAndDelete(id);
      const list = await Product.find().lean();
      io.emit("updateProducts", list);
      if (ack) ack({ status: "success" });
    } catch (err) {
      if (ack) ack({ status: "error", error: err.message });
    }
  });
});

// Levantar el servidor
servidorHttp.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});