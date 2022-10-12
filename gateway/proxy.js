const {createProxyMiddleware} = require('http-proxy-middleware');

// adds proxyMiddleware to each route
// rules that are applied to incoming requests
const setupProxies = (app, routes) => {
    routes.forEach(r => {
        app.use(r.url, createProxyMiddleware(r.proxy));
    })
}

exports.setupProxies = setupProxies