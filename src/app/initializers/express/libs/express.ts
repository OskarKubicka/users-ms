export default function createServer({
    json, urlencoded, app, cors, compression, helmet, logger
}) {
    return Object.freeze({ server })

    function server({ hostname, port, routes }) {

        app.use(helmet());
        app.options('*', cors({ credentials: true, origin: true }));
        app.use(cors());
        app.use(compression());
        app.use(json());
        app.use(urlencoded({ extended: true }))

        //     app.get('/', (req, res) => res.json({ data: 'Hello World' }))

        //    app.post('/', (req, res) => res.json(req.body))
        for (let route of routes) {
            app[route.method](`${route.path}`, route.component)
        }

        app.listen(port, hostname, () => {
            logger.info(`[Express] server running at http://${hostname}:${port}/`)
            return;
        })
    }
}