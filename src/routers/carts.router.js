import { Router } from "express";
import mongoose from "mongoose";
import cartModel from "../models/Cart.model.js";
import Product from "../models/Product.model.js";

const router = Router();

// Crear un carrito nuevo
router.post("/", async (req, res) => {
  try {
    const newCart = await cartModel.create({ products: [] });
    res.status(201).json(newCart);
  } catch (err) {
    console.error("Error al crear carrito:", err);
    res.status(500).json({ error: "Error interno al crear carrito" });
  }
});

// Obtener carrito por ID (populate)
router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  if (!mongoose.Types.ObjectId.isValid(cid)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const cart = await cartModel.findById(cid).populate("products.product");
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    res.json(cart);
  } catch (err) {
    console.error("Error al obtener carrito:", err);
    res.status(500).json({ error: "Error interno al obtener carrito" });
  }
});

// Agregar producto al carrito
router.post("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const cart = await cartModel.findById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    const product = await Product.findById(pid);
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });

    const existingProduct = cart.products.find(p => p.product.toString() === pid);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();
    res.json({ message: "Producto agregado al carrito", cart });
  } catch (err) {
    console.error("Error al agregar producto al carrito:", err);
    res.status(500).json({ error: "Error interno al agregar producto al carrito" });
  }
});

// Actualizar cantidad de un producto
router.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  let { quantity } = req.body;

  if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  quantity = parseInt(quantity);
  if (isNaN(quantity)) {
    return res.status(400).json({ error: "Cantidad inválida" });
  }

  try {
    const cart = await cartModel.findById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    const productInCart = cart.products.find(p => p.product.toString() === pid);
    if (!productInCart) {
      return res.status(404).json({ error: "Producto no encontrado en carrito" });
    }

    if (quantity <= 0) {
      cart.products = cart.products.filter(p => p.product.toString() !== pid);
    } else {
      productInCart.quantity = quantity;
    }

    await cart.save();
    res.json({ message: "Cantidad actualizada", cart });
  } catch (err) {
    console.error("Error al actualizar cantidad:", err);
    res.status(500).json({ error: "Error interno al actualizar cantidad" });
  }
});

// Reemplazar todos los productos del carrito
router.put("/:cid", async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body;

  if (!mongoose.Types.ObjectId.isValid(cid)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const cart = await cartModel.findById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    cart.products = products;
    await cart.save();

    res.json({ message: "Carrito actualizado", cart });
  } catch (err) {
    console.error("Error al actualizar carrito:", err);
    res.status(500).json({ error: "Error interno al actualizar carrito" });
  }
});

// Eliminar un producto del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const cart = await cartModel.findById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    await cart.save();

    res.json({ message: "Producto eliminado del carrito", cart });
  } catch (err) {
    console.error("Error al eliminar producto:", err);
    res.status(500).json({ error: "Error interno al eliminar producto" });
  }
});

// Vaciar carrito
router.delete("/:cid", async (req, res) => {
  const { cid } = req.params;

  if (!mongoose.Types.ObjectId.isValid(cid)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const cart = await cartModel.findById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    cart.products = [];
    await cart.save();

    res.json({ message: "Carrito vaciado", cart });
  } catch (err) {
    console.error("Error al vaciar carrito:", err);
    res.status(500).json({ error: "Error interno al vaciar carrito" });
  }
});

export default router;