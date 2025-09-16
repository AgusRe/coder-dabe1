import { Router } from "express";
import { productModel } from "../models/Product.model.js";

const router = Router();

/**
 * GET /api/products
 * Query params:
 * - limit (default 10)
 * - page (default 1)
 * - sort = "asc" | "desc" (por precio)
 * - query = categoría o "available"
*/
router.get("/", async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        // filtro dinámico
        let filter = {};
        if (query) {
        if (query === "available") {
            filter.status = true;
        } else {
            filter.category = query;
        }
        }

        // orden dinámico
        let sortOption = {};
        if (sort) sortOption.price = sort === "asc" ? 1 : -1;

        // paginación
        const result = await productModel.paginate(filter, {
            limit,
            page,
            sort: sortOption,
            lean: true
        });

        res.json({
            status: "success",
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage
                ? `/api/products?page=${result.prevPage}&limit=${limit}`
                : null,
            nextLink: result.hasNextPage
                ? `/api/products?page=${result.nextPage}&limit=${limit}`
                : null
        });
    } catch (err) {
        res.status(500).json({ status: "error", error: err.message });
    }
});

// GET /api/products/:pid
router.get("/:pid", async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid).lean();
        if (!product) {
            return res.status(404).json({ status: "error", error: "Producto no encontrado" });
        }
        res.json({ status: "success", payload: product });
    } catch (err) {
        res.status(400).json({ status: "error", error: "ID inválido" });
    }
});

// POST /api/products
router.post("/", async (req, res) => {
    try {
        const { title, description, code, price, stock, category, thumbnails } = req.body;

        // Validaciones
        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).json({ status: "error", error: "Todos los campos son obligatorios" });
        }
        if (price <= 0) {
            return res.status(400).json({ status: "error", error: "El precio debe ser mayor que 0" });
        }
        if (stock < 0) {
            return res.status(400).json({ status: "error", error: "El stock no puede ser negativo" });
        }

        const product = await productModel.create({
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnails,
            status: true
        });

        res.status(201).json({ status: "success", payload: product });
    } catch (err) {
        res.status(400).json({ status: "error", error: err.message });
    }
});

//PUT /api/products/:pid
router.put("/:pid", async (req, res) => {
    try {
        const updates = req.body;
        if (updates.price && updates.price <= 0) {
            return res.status(400).json({ status: "error", error: "El precio debe ser mayor que 0" });
        }
        if (updates.stock && updates.stock < 0) {
            return res.status(400).json({ status: "error", error: "El stock no puede ser negativo" });
        }

        const updated = await productModel.findByIdAndUpdate(req.params.pid, updates, { new: true });
        if (!updated) {
            return res.status(404).json({ status: "error", error: "Producto no encontrado" });
        }
        res.json({ status: "success", payload: updated });
    } catch (err) {
        res.status(400).json({ status: "error", error: "ID inválido" });
    }
});

//DELETE /api/products/:pid
router.delete("/:pid", async (req, res) => {
    try {
        const deleted = await productModel.findByIdAndDelete(req.params.pid);
        if (!deleted) {
            return res.status(404).json({ status: "error", error: "Producto no encontrado" });
        }
        res.json({ status: "success", message: "Producto eliminado" });
    } catch (err) {
        res.status(400).json({ status: "error", error: "ID inválido" });
    }
});

export default router;