import { Router } from "express";
import { productModel } from "../models/Product.model.js";
import { cartModel } from "../models/Cart.model.js";

const router = Router();

// Vista con listado de productos y paginación

router.get("/products", async (req, res) => {
  try {
    const { page = 1, limit = 10, sort, query } = req.query;

    let filter = {};
    if (query) {
      if (query === "available") filter.status = true;
      else filter.category = query;
    }

    let sortOption = {};
    if (sort) sortOption.price = sort === "asc" ? 1 : -1;

    const result = await productModel.paginate(filter, {
      page,
      limit,
      sort: sortOption,
      lean: true
    });

    // Construir base url para links manteniendo otros query params
    const baseUrl = (p) => {
      const params = new URLSearchParams();
      if (p) params.set("page", p);
      if (limit) params.set("limit", limit);
      if (sort) params.set("sort", sort);
      if (query) params.set("query", query);
      const s = params.toString();
      return `/products${s ? "?" + s : ""}`;
    };

    res.render("products", {
      products: result.docs,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      totalPages: result.totalPages,
      prevLink: result.hasPrevPage ? baseUrl(result.prevPage) : null,
      nextLink: result.hasNextPage ? baseUrl(result.nextPage) : null,
      queryParams: { page, limit, sort, query }
    });
  } catch (err) {
    res.status(500).send("Error al cargar productos");
  }
});

// Vista de detalle de un producto

router.get("/products/:pid", async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).lean();
    if (!product) return res.status(404).send("Producto no encontrado");
    res.render("productDetail", { product });
  } catch (err) {
    res.status(500).send("Error al cargar producto");
  }
});

// Vista de un carrito específico
router.get("/carts/:cid", async (req, res) => {
  try {
    const cart = await cartModel
      .findById(req.params.cid)
      .populate("products.product")
      .lean();

    if (!cart) return res.status(404).send("Carrito no encontrado");

    res.render("cartDetail", { cart });
  } catch (err) {
    res.status(500).send("Error al cargar carrito");
  }
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await productModel.find().lean();
    res.render("realTimeProducts", { products });
  } catch (err) {
    res.status(500).send("Error al cargar realtime products");
  }
});

export default router;