import http from 'http'
import {app, router} from './app.js'

const PORT = 3000
const server = http.createServer(app);

server.listen(PORT)