import {Router} from 'express';
import CartManager from '../managers/CartManager.js';

const router = Router();

const cartManager = new CartManager('./src/data/carts.json');

router.post('/', async (req, res) => {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
});

router.get('/:cid', async (req, res) => {
    const cid = Number(req.params.cid);
    const cart = await cartManager.getCartById(cid);
    cart ? res.json(cart) : res.status(404).json({error: 'Carrito no encontrado'});
});

router.post("/:cid/product/:pid", async (req, res) => {
    const {cid, pid} = Number(req.params);
    const result = await cartManager.addProductToCart(cid, pid);

    res.json(result);
});

export default router;