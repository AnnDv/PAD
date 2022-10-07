const Keycloack = require('keycloack-connect');
const session = require('express-session');

const setupAuth = (app, routes) => {
    let memoryStore = new session.MemoryStore();
    let keycloack = new Keycloack({store: memoryStore});

    app.use(session({
        secret: 
    })
}