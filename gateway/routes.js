const ROUTES = [
    {
        url: '/authentication',
        auth: true,
        // rateLimit: {
        //     windowMs: 15 * 60 * 1000,
        //     max: 5
        // },
        proxy: {
            target: "localhost:8000",
            changeOrigin: true,
        }
    },
    {
        url: '/history',
        auth: true,
        // rateLimit: {
        //     windowMs: 15 * 60 * 1000,
        //     max: 5
        // },
        proxy: {
            target: "localhost:8000",
            changeOrigin: true,
        }
    },
    {
        url: '/recognition',
        auth: false,
        // rateLimit: {
        //     windowMs: 15 * 60 * 1000,
        //     max: 5
        // },
        proxy: {
            target: "localhost:8000",
            changeOrigin: true,
        }
    },
    {
        url: '/recommendation',
        auth: true,
        // rateLimit: {
        //     windowMs: 15 * 60 * 1000,
        //     max: 5
        // },
        proxy: {
            target: "localhost:8000",
            changeOrigin: true,
        }
    }
]

exports.ROUTES = ROUTES;