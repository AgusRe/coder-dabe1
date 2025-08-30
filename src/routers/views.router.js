import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const pm = new ProductManager("src/data/products.json");

// Página principal con listado de productos (estática por HTTP)
router.get("/", async (req, res) => {
  const products = await pm.getProducts();
  res.render("home", { products }); // Ver si es products: products
});

// Página de productos en tiempo real con websockets
router.get("/realtimeproducts", async (req, res) => {
  const products = await pm.getProducts();
  res.render("realTimeProducts", { products });
});

export default router;
