import {Router} from 'express';
import ProductManager from '../managers/ProductManager.js';

// Creamos el router
const router = Router();

// Inicializamos json
const productManager = new ProductManager('./data/products.json');

// get: Obtener datos de los producots

router.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.json(products);
});

router.get('/:pid', async (req, res) => {
    const pid = Number(req.params.pid);
    const product = await productManager.getProductById(pid);
    product ? res.json(product) : res.status(404).json({error: 'Producto no encontrado'});
})

// post: Crear un producto

router.post('/', async (req, res) => {
    const newProduct = await productManager.addProduct(req.body);
    res.status(201).json(newProduct);
})

// put: Actualizar un producto

router.put('/:pid', async (req, res) => {
    const updated = await productManager.updateProduct(Number(req.params.pid), req.body);
    res.json(updated);
})

// delete: Eliminar un producto

router.delete('/:pid', async (req, res) => {
    const deleted = await productManager.deleteProduct(Number(req.params.pid));
    deleted ? res.json({message: 'Producto eliminado'}) : res.status(404).json({error: 'Producto no encontrado'});
});

export default router;