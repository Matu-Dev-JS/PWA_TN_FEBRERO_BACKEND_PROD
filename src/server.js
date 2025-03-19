import ENVIROMENT from "./config/enviroment.config.js";
import express from 'express'
import authRouter from "./routes/auth.router.js";
import mongoose from "./config/mongoDB.config.js";
import { sendMail } from "./utils/mailer.utils.js";
import cors from 'cors'
import { verifyLuckyMiddleware } from "./middlewares/verifyLuckyMiddleware.js";
import { authMiddleware } from "./middlewares/authMiddleware.js";
import workspace_router from "./routes/workspace.router.js";
import channelRouter from "./routes/channel.router.js";
import messageRepository from "./repositories/message.repository.js";
import { ServerError } from "./utils/errors.utils.js";

import rateLimit from "express-rate-limit";

const app = express()



//Dehabilito la politica de cors
//Si quieren un backend publico
app.use(cors(
    {
        origin: ENVIROMENT.URL_FRONTEND
    }
))
/* //Blacklist de ip
const blockedIps = ['123.45.57.89']

//Pasenlo a un middleware
app.use((req, res, next) => {
    const client_ip = req.ip 
    if(!blockedIps.includes(client_ip)){
        next()
    }
    else{
        new ServerError( 'No tienes permisos para acceder', 401 )
    }
}) */

//Whitelist de ip

/* 
const whiteListIp = ['123.45.57.89']

app.use((req, res, next) => {
    const client_ip = req.ip 
    if(whiteListIp.includes(client_ip)){
        next()
    }
    else{
        new ServerError( 'No tienes permisos para acceder', 401 )
    }
}) */

const rateLimiterMiddleware = rateLimit(
    {
        windowMs: 15 * 60 * 1000,//Tiempo o periodo de evaluacion
        max: 3, //Maximas consultas en el tiempo establecido
        message: {message: 'Baja un cambio bot'},
        standardHeaders: 'draft-8'
    }
)

app.use(rateLimiterMiddleware)

//Si quieren que sea reservado para cierto dominio
/* 
app.use(cors(
    {
        origin: ENVIROMENT.URL_FRONTEND
    }
)) 
*/
app.use(express.json(
    {
        limit: '2mb'
    }
))


/* 
Crear una ruta llamada /api/auth

POST /register
body {
    username
    email
    password
}

response: {
    message: "User registered",
    status:201,
    ok: true
}

NO SE DEBE GUARDAR AL USUARIO EN NINGUN LADO con consologuear que llegan los datos en el body basta
Probar hacer el registro con postman
*/
/* Hola */

app.use('/api/auth', authRouter)
app.use('/api/workspaces', workspace_router)
app.use('/api/channels', channelRouter)

app.get('/api/test/comprar', authMiddleware, (req, res) =>{
    console.log(req.user)
    res.json({
        message: 'Producto comprado'
    })
})

app.listen(ENVIROMENT.PORT, () =>{
    console.log(`El servidor se esta ejecutando en http://localhost:${ENVIROMENT.PORT}`)
})



