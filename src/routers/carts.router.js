import { Router } from "express";
import mongoose from "mongoose";
import Cart from "../models/Cart.model.js";
import Product from "../models/Product.model.js";

const router = Router();

// POST /carts (Crea un carrito vacío)
router.post("/", async (req, res) => {
  try {
    const cart = await Cart.create({ products: [] });
    res.status(201).json({ status: "success", payload: cart });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

// GET /carts/:cid (Trae carrito por ID con populate de productos)
router.get("/:cid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate("products.product").lean();
    if (!cart) return res.status(404).json({ status: "error", error: "Carrito no encontrado" });
    res.json({ status: "success", payload: cart });
  } catch (err) {
    res.status(400).json({ status: "error", error: "ID inválido" });
  }
});

// POST /carts/:cid/products/:pid (Agrega producto al carrito)
router.post("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
      return res.status(400).json({ status: "error", error: "ID inválido" });
    }
    const product = await Product.findById(pid);
    if (!product) return res.status(404).json({ status: "error", error: "Producto no encontrado" });

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: "error", error: "Carrito no encontrado" });

    const existing = cart.products.find((p) => p.product.toString() === pid);
    if (existing) existing.quantity += 1;
    else cart.products.push({ product: pid, quantity: 1 });

    await cart.save();
    res.json({ status: "success", payload: cart });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

// DELETE /carts/:cid/products/:pid (Elimina un producto específico del carrito)
router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
      return res.status(400).json({ status: "error", error: "ID inválido" });
    }
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: "error", error: "Carrito no encontrado" });

    cart.products = cart.products.filter((p) => p.product.toString() !== pid);
    await cart.save();
    res.json({ status: "success", payload: cart });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

// PUT /carts/:cid (Reemplaza todos los productos del carrito con un nuevo array)
router.put("/:cid", async (req, res) => {
  try {
    const { products } = req.body;
    if (!Array.isArray(products)) {
      return res.status(400).json({ status: "error", error: "Se requiere un arreglo 'products'" });
    }
    const cid = req.params.cid;
    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(400).json({ status: "error", error: "ID inválido" });
    }
    // validate product ids
    for (const p of products) {
      if (!p.product || !mongoose.Types.ObjectId.isValid(p.product) || !p.quantity || p.quantity <= 0) {
        return res.status(400).json({ status: "error", error: "Formato de products inválido" });
      }
      const exists = await Product.findById(p.product);
      if (!exists) return res.status(404).json({ status: "error", error: `Producto ${p.product} no existe` });
    }
    const updated = await Cart.findByIdAndUpdate(cid, { products }, { new: true });
    if (!updated) return res.status(404).json({ status: "error", error: "Carrito no encontrado" });
    res.json({ status: "success", payload: updated });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

// PUT /carts/:cid/products/:pid (Actualiza la cantidad de un producto específico)
router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { quantity } = req.body;
    const { cid, pid } = req.params;
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ status: "error", error: "Cantidad inválida" });
    }
    if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
      return res.status(400).json({ status: "error", error: "ID inválido" });
    }
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: "error", error: "Carrito no encontrado" });

    const productInCart = cart.products.find((p) => p.product.toString() === pid);
    if (!productInCart) return res.status(404).json({ status: "error", error: "Producto no encontrado en carrito" });

    productInCart.quantity = quantity;
    await cart.save();
    res.json({ status: "success", payload: cart });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});
// DELETE /carts/:cid (Vacia el carrito)

router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(400).json({ status: "error", error: "ID inválido" });
    }
    const updated = await Cart.findByIdAndUpdate(cid, { products: [] }, { new: true });
    if (!updated) return res.status(404).json({ status: "error", error: "Carrito no encontrado" });
    res.json({ status: "success", payload: updated });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

export default router;