import { Router } from "express";
import { cartModel } from "../models/Cart.model.js";

const router = Router();

// POST /api/carts (Crea un carrito vacío)

router.post("/", async (req, res) => {
    try {
        const newCart = await cartModel.create({ products: [] });
        res.status(201).json({ status: "success", payload: newCart });
    } catch (err) { 
        res.status(500).json({ status: "error", error: err.message }); 
    }
});

// GET /api/carts/:cid (Trae carrito por ID con populate de productos)

router.get("/:cid", async (req, res) => {
    try {
        const cart = await cartModel
            .findById(req.params.cid)
            .populate("products.product")
            .lean();
        
        // Si no existe el carrito
        if (!cart) {
            return res.status(404).json({ status: "error", error: "Carrito no encontrado" });
        }

        res.json({ status: "success", payload: cart });
    } catch (err) {
        res.status(500).json({ status: "error", error: err.message });
    }
});

// POST /api/carts/:cid/products/:pid (Agrega producto al carrito)

router.post("/:cid/products/:pid", async (req, res) => {
    try {
        const cart = await cartModel.findById(req.params.cid);
        if (!cart) {
            return res.status(404).json({ status: "error", error: "Carrito no encontrado" });
        }

        const pid = req.params.pid;
        const existingProduct = cart.products.find(
            (p) => p.product.toString() === pid
        );

        // Si el producto ya está en el carrito, aumenta la cantidad
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }

        await cart.save();
        res.json({ status: "success", payload: cart });
    } catch (err) {
        res.status(500).json({ status: "error", error: err.message });
    }
});

// DELETE /api/carts/:cid/products/:pid (Elimina un producto específico del carrito)

router.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const cart = await cartModel.findById(req.params.cid);
        if (!cart) {
            return res.status(404).json({ status: "error", error: "Carrito no encontrado" });
        }

        cart.products = cart.products.filter(
            (p) => p.product.toString() !== req.params.pid
        );

        await cart.save();
        res.json({ status: "success", payload: cart });
    } catch (err) {
        res.status(500).json({ status: "error", error: err.message });
    }
});

// PUT /api/carts/:cid (Reemplazar todos los productos del carrito con un nuevo array)

router.put("/:cid", async (req, res) => {
    try {
        const { products } = req.body; // array de { product, quantity }
        const updatedCart = await cartModel.findByIdAndUpdate(
            req.params.cid,
            { products },
            { new: true }
        );

        if (!updatedCart) {
            return res.status(404).json({ status: "error", error: "Carrito no encontrado" });
        }

        res.json({ status: "success", payload: updatedCart });
    } catch (err) {
        res.status(500).json({ status: "error", error: err.message });
    }
});

// PUT /api/carts/:cid/products/:pid (Actualiza la cantidad de un producto específico)

router.put("/:cid/products/:pid", async (req, res) => {
    try {
        const { quantity } = req.body;
        const cart = await cartModel.findById(req.params.cid);
        
        if (!cart) {
            return res.status(404).json({ status: "error", error: "Carrito no encontrado" });
        }

        const productInCart = cart.products.find(
            (p) => p.product.toString() === req.params.pid
        );
        if (!productInCart) {
            return res.status(404).json({ status: "error", error: "Producto no encontrado en el carrito" });
        }

        productInCart.quantity = quantity;
        await cart.save();

        res.json({ status: "success", payload: cart });
    } catch (err) {
        res.status(500).json({ status: "error", error: err.message });
    }
});

// DELETE /api/carts/:cid (Vacia el carrito)

router.delete("/:cid", async (req, res) => {
    try {
        const cart = await cartModel.findByIdAndUpdate(
            req.params.cid,
            { products: [] },
            { new: true }
        );

        if (!cart) {
            return res.status(404).json({ status: "error", error: "Carrito no encontrado" });
        }

        res.json({ status: "success", payload: cart });
    } catch (err) {
        res.status(500).json({ status: "error", error: err.message });
    }
});

export default router;