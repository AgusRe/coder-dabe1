const fs = require(fs).promises;

class UserManager {
    constructor(path) {
        this.path = path;
    }
    
    async getUsers() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        }
        catch (error) {
            if(error.code === 'nousuario') return [];
            console.error("Hay error de lectura");
            return [];
        }
    }

    async addUser(user) {
        try {
            const users = await thiis.getUsers();
            const newUser = { // ... es para destructurar el objeto
                id:Date.now(), ...user
            }
            users.push(newUser);
            await fs.writeFile(this.path, JSON.stringify(users, null, 2)) // El null 2, corrige esapcios y le da una sangria de 2 
            console.log("Usuario agregado correctamente");
        }
        catch (error) {
            console.error("Error al agregar el usuario:", error);
        }
    }

    async deleteUser(id) {
        try{
            const users = await this.getUsers();
            const filtered = users.filter(user => user.id !== id);

            await fs.writeFile(this.path, JSON.stringify(filtered, null, 2));

            console.log("Usuario eliminado correctamente");
        }
        catch (error) {
            console.error("Error al eliminar el usuario:", error);
        }
    }
}

