import {promises as fs} from 'fs'; 
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // Convierte urls en rutas de archivos

const __dirname = path.dirname(__filename); // Obtiene el directorio del archivo actual

class CartManager {
    constructor(filePath) {
        this.path = path.resolve(__dirname, '..', filePath);
    }

    async getCarts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        }
        catch (error) {
            console.error('Error leyendo los carritos:', error);
            return [];
        }
    }

    async createCart() {
        const carts = await this.getCarts();
        const newId = carts.length > 0 ? carts.at(-1).id + 1 : 1;

        const newCart = {
            id: newId,
            products: []
        }

        carts.push(newCart);
        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        return newCart;
    }

    async getCartById(id) {
        const carts = await this.getCarts();
        return carts.find(cart => cart.id === id) || null;
    }

    async addProductToCart(cartId, productId) {
        const carts = await this.getCarts();
        const cart = carts.find(c => c.id === cartId);

        if (!cart) {
            return { error: 'Carrito no encontrado' };
        }

        // Buscamos si existe ya el producto en el carrito
        const existingProduct = cart.products.findIndex(p => p.id === productId);
        
        if (existingProduct === -1) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        return cart;
    }
}

export default CartManager;