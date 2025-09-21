import { Router } from "express";
import Product from "../models/Product.model.js";
import cartModel from "../models/Cart.model.js";

const router = Router();

// Vista de productos
router.get("/products", async (req, res) => {
  try {
    const { page = 1, limit = 10, sort, query } = req.query;
    const limitNum = parseInt(limit) || 10;
    const pageNum = parseInt(page) || 1;

    let filter = {};
    if (query) {
      if (query === "available" || query === "true" || query === "status=true") filter.status = true;
      else filter.category = query;
    }

    const sortOption = sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {};

    const result = await Product.paginate(filter, {
      page: pageNum,
      limit: limitNum,
      sort: sortOption,
      lean: true
    });

    res.render("products", {
      products: result.docs,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      totalPages: result.totalPages,
      prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}` : null,
      nextLink: result.hasNextPage ? `/products?page=${result.nextPage}` : null
    });
  } catch {
    res.status(500).send("Error al cargar productos");
  }
});

// Detalle de producto
router.get("/products/:pid", async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid).lean();
    if (!product) return res.status(404).send("Producto no encontrado");
    res.render("productDetail", { product });
  } catch {
    res.status(500).send("Error al cargar producto");
  }
});

// Vista carrito
router.get("/carts/:cid", async (req, res) => {
  try {
    const cart = await cartModel.findById(req.params.cid).populate("products.product").lean();
    if (!cart) return res.status(404).send("Carrito no encontrado");
    res.render("carts", { cart });
  } catch (err) {
    console.error("Error al cargar carrito:", err);
    res.status(500).send("Error al cargar carrito");
  }
});

// Vista realtime
router.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await Product.find().lean();
    res.render("realTimeProducts", { products });
  } catch {
    res.status(500).send("Error al cargar realtime");
  }
});

export default router;
