import {promises as fs} from 'fs'; 
import path from 'path';
import { fileURLToPath } from 'url';

// Configuracion __dirname en modulos

const __filename = fileURLToPath(import.meta.url); // Convierte urls en rutas de archivos

const __dirname = path.dirname(__filename); // Obtiene el directorio del archivo actual

class ProductManager {
    constructor(filePath) {
        this.path = path.resolve(__dirname, '..', filePath);
    }

    async getProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error leyendo los productos:', error);
            return [];
        }
    }

    async getProductById(id) {
        const products = await this.getProducts();
        return products.find(product => product.id === id) || null;
    }

    async addProduct(productData) {
        const products = await this.getProducts();
        const newId = products.length > 0 ? products.at(-1).id + 1 : 1;
        
        const newProduct = {
            id: newId,
            title: productData.title,
            description: productData.description,
            code: productData.code,
            price: productData.price,
            status: productData.status ?? true,
            stock: productData.stock,
            category: productData.category,
            thumbnails: productData.thumbnails || []
        }

        products.push(newProduct);
        await fs.writeFile(this.path, JSON.stringify(products, null, 2), "utf-8");
    }

    async updateProduct(id, updates) {
        const products = await this.getProducts();
        const index = products.findIndex(product => product.id === id);
        
        if (index === -1) return {error: "No se encontró producto"}
        
        delete updates.id;
        products[index] = {...products[index], ...updates};
        await fs.writeFile(this.path, JSON.stringify(products, null, 2), "utf-8");
        return products[index];
    }

    async deleteProduct(id) {
        const products = await this.getProducts();
        const updated = products.filter(product => product.id != id);
        await fs.writeFile(this.path, JSON.stringify(updated, null, 2));
        return {message: `Producto ${id} eliminado`}
    }
}

export default ProductManager;