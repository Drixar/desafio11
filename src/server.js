import express from 'express';
import expressHandlebars from 'express-handlebars';
import {Server} from 'socket.io';
import Handlebars from 'handlebars'
import path from 'path';
import {DaoProducts,DaoCarts,DaoChats} from "../daos/index.js";
import productRouter from "./routes/productRouter.js";
import cartRouter from "./routes/cartRouter.js"
import viewsRouter from './routes/viewsRouter.js';
import {fileURLToPath} from 'url';
import {allowInsecurePrototypeAccess} from '@handlebars/allow-prototype-access';
import mongoose from 'mongoose';
import { options } from '../config/config.js';
import { connectionString } from '../config/config.js';
import sessionRouter  from './routes/sessionRouter.js'
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport'
import initializePassport from "../config/passport.config.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productsService = DaoProducts;
const chatService = DaoChats;
const cartService = DaoChats;

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, ()=>console.log(`listening on port ${PORT}`));
const io = new Server(server);
console.log(new Date())

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use((req, res, next) => {
    req.io = io;
    return next();
  });

app.use(express.static(path.join(__dirname, '/public')))
// app.engine('handlebars', handlebars.engine())
app.engine('handlebars', expressHandlebars.engine({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set('views', path.join(__dirname,'/views'))
app.set('view engine', 'handlebars')

app.use(session({
    store: MongoStore.create({
        mongoUrl: connectionString
    }),
    secret: 'mysecret',
    resave: true,
    saveUninitialized: true 
}))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

mongoose.connect(connectionString,options.mongoDB)
.then(() => {console.log("conexion exitosa")})
.catch(err =>{console.log(`connection failed ${err}`)
})

app.use("/api/products", productRouter);
app.use("/api/carts/", cartRouter);
app.use("/", viewsRouter);
app.use('/sessions', sessionRouter)

//trabajar con archivos estaticos de la carpeta public
app.use(express.static(__dirname+"/public"));

let historicoMensajes = [];

//websocket
io.on("connection",async(socket)=>{
    console.log("nuevo usuario conectado", socket.id);

    socket.emit("products", await productsService.getAll())

    //recibimos el nuevo producto del cliente y lo guardamos
    socket.on("newProduct",async(data)=>{
        await productsService.save(data);
        //enviamos la lista de productos actualizada a todos los sockets conectados
        io.sockets.emit("products", await productsService.getAll());
    })

    //enviar a todos menos al socket conectado
    socket.broadcast.emit("newUser");

     socket.emit("historico", await chatService.getAll());

    socket.on("message",async data=>{
        await chatService.add(data)
        io.sockets.emit("historico",await chatService.getAll());
    });
})

export default io;