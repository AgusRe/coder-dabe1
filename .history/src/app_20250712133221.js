const UserManager = require('./managers/UserManager.js');

const path = require('path');

const usersFilePath = path.join(__dirname, 'users.json');

const manager = new UserManager(usersFilePath);

const test = async () => {
    console.log("Agregar usuario");

    await manager.addUser({
        name: "Agustín",
        email: "mail@gmail.com",
        age: 22
    });

    await manager.addUser({
        name: "Pedro",
        email: "mail@gmail.com",
        age: 22
    });

    await manager.addUser({
        name: "Agustín",
        email: "mail@gmail.com",
        age: 22
    });
}

test()