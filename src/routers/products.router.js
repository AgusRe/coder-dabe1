import { Router } from "express";
import Product from "../models/Product.model.js";

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
    const limitNum = parseInt(limit) || 10;
    const pageNum = parseInt(page) || 1;

    let filter = {};
    if (query) {
      if (query === "available" || query === "true" || query === "status=true") {
        filter.status = true;
      } else {
        filter.category = query;
      }
    }

    let sortOption = {};
    if (sort === "asc") sortOption.price = 1;
    else if (sort === "desc") sortOption.price = -1;

    const options = {
      page: pageNum,
      limit: limitNum,
      sort: sortOption,
      lean: true
    };

    const result = await Product.paginate(filter, options);

    const buildLink = (p) => {
      const params = new URLSearchParams();
      params.set("page", p);
      params.set("limit", limitNum);
      if (sort) params.set("sort", sort);
      if (query) params.set("query", query);
      return `/api/products?${params.toString()}`;
    };

    res.json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? buildLink(result.prevPage) : null,
      nextLink: result.hasNextPage ? buildLink(result.nextPage) : null
    });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

// GET /api/products/:pid
router.get("/:pid", async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid).lean();
    if (!product) return res.status(404).json({ status: "error", error: "Producto no encontrado" });
    res.json({ status: "success", payload: product });
  } catch (err) {
    res.status(400).json({ status: "error", error: "ID inválido" });
  }
});

// POST /api/products
router.post("/", async (req, res) => {
  try {
    const { title, description, code, price, stock, category, thumbnails } = req.body;
    if (!title || !description || !code || price == null || stock == null || !category) {
      return res.status(400).json({ status: "error", error: "Faltan campos requeridos" });
    }
    if (price <= 0) return res.status(400).json({ status: "error", error: "Precio inválido" });
    if (stock < 0) return res.status(400).json({ status: "error", error: "Stock inválido" });

    const product = await Product.create({
      title, description, code, price, stock, category, thumbnails, status: true
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
    if (updates.price != null && updates.price <= 0) {
      return res.status(400).json({ status: "error", error: "Precio inválido" });
    }
    if (updates.stock != null && updates.stock < 0) {
      return res.status(400).json({ status: "error", error: "Stock inválido" });
    }
    delete updates._id;
    const updated = await Product.findByIdAndUpdate(req.params.pid, updates, { new: true });
    if (!updated) return res.status(404).json({ status: "error", error: "Producto no encontrado" });
    res.json({ status: "success", payload: updated });
  } catch (err) {
    res.status(400).json({ status: "error", error: "ID inválido" });
  }
});

//DELETE /api/products/:pid
router.delete("/:pid", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.pid);
    if (!deleted) return res.status(404).json({ status: "error", error: "Producto no encontrado" });
    res.json({ status: "success", message: "Producto eliminado" });
  } catch (err) {
    res.status(400).json({ status: "error", error: "ID inválido" });
  }
});

export default router;