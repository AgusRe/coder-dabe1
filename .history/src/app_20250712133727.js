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
        email: "mailasd@gmail.com",
        age: 26
    });

    await manager.addUser({
        name: "Abril",
        email: "maifasfl@gmail.com",
        age: 18
    });

    console.log("\n Lista de usuarios \n");
    const todos = await manager.getUsers();
    console.log(todos);

    if(todos.length > 0)
}

test()