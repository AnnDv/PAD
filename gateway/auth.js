const Keycloack = require('keycloak-connect');
const session = require('express-session');

const setupAuth = (app, routes) => {
    let memoryStore = new session.MemoryStore();
    let keycloak = new Keycloack({store: memoryStore});

    app.use(session({
        secret: '<RANDOM GENERATED TOKEN>',
        resave: false,
        saveUninitialized: true,
        store: memoryStore
    }));

    app.use(keycloak.middleware());

    routes.forEach(r => {
        if (r.auth) {
            app.use(r.url, keycloak.protect(), function (req, res, next) {
                next();
            });
        }
    });
}

exports.setupAuth = setupAuth
