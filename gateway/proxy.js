const {createProxyMiddleware} = require('http-proxy-middleware');

// adds proxyMiddleware to each route
const setupProxies = (app, routes) => {
    routes.forEach(r => {
        app.use(r.url, createProxyMiddleware(r.proxy));
    })
}

exports.setupProxies = setupProxies