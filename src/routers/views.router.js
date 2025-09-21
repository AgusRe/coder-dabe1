import { Router } from "express";
import Product from "../models/Product.model.js";
import cartModel from "../models/Cart.model.js";

const router = Router();

// Vista con listado de productos y paginación
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

    const buildLink = (p) => {
      const params = new URLSearchParams();
      params.set("page", p);
      params.set("limit", limitNum);
      if (sort) params.set("sort", sort);
      if (query) params.set("query", query);
      return `/products?${params.toString()}`;
    };

    res.render("products", {
      products: result.docs,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      totalPages: result.totalPages,
      prevLink: result.hasPrevPage ? buildLink(result.prevPage) : null,
      nextLink: result.hasNextPage ? buildLink(result.nextPage) : null,
      queryParams: { page: pageNum, limit: limitNum, sort, query }
    });
  } catch {
    res.status(500).send("Error al cargar productos");
  }
});

// Vista de detalle de un producto
router.get("/products/:pid", async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid).lean();
    if (!product) return res.status(404).send("Producto no encontrado");
    res.render("productDetail", { product });
  } catch {
    res.status(500).send("Error al cargar producto");
  }
});

// Carrito "default" (el primero encontrado)
router.get("/carts", async (req, res) => {
  try {
    const cart = await cartModel.findOne().populate("products.product").lean();
    if (!cart) return res.render("carts", { cart: { products: [] } });
    res.render("carts", { cart });
  } catch (err) {
    console.error("Error al obtener carrito:", err);
    res.status(500).send("Error interno al obtener carrito");
  }
});

// Carrito por ID
router.get("/carts/:cid", async (req, res) => {
  try {
    const cart = await cartModel.findById(req.params.cid).populate("products.product").lean();
    if (!cart) return res.render("carts", { cart: { products: [] } });
    res.render("carts", { cart });
  } catch (err) {
    console.error("Error al obtener carrito:", err);
    res.status(500).send("Error interno al obtener carrito");
  }
});

// Vista de productos en tiempo real
router.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await Product.find().lean();
    res.render("realTimeProducts", { products });
  } catch {
    res.status(500).send("Error al cargar realtime");
  }
});

export default router;