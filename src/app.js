import express from "express"
const app = express()
import config from "./config.js"
import cors from "cors"

var allowlist = config.ALLOW_LIST_HOSTS.split(',')
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: true } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}
app.use(cors(corsOptionsDelegate))
//Configuraciones
app.set("port", config.PORT)
app.set('json spaces', 2)

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

import indexRoutes from "./routes/index.routes.js"
import authRoutes from "./routes/auth.routes.js"
app.use(indexRoutes)
app.use(authRoutes)

export default app