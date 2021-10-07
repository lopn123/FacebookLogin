//import
import express from "express";
import path from "path";
import session from "express-session";
import mongoDB from "./modules/mongoDB";
import {swaggerUi, specs} from "./modules/swagger"
import router from "./routes/router";
import login from "./routes/login";
import profile from "./routes/profile";
import socketIo from "socket.io";
//variable
const app = express();
const port = 80;

declare module "express-session"
{
    interface Session
    {
        userID : String;
    }
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(session({
    secret : 'SecretPlace',
    resave : false,
    saveUninitialized : true
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
mongoDB();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {explorer: true}));
app.use('/', login);
app.use('/', profile);
app.use('/', router);

app.listen(port, () => {
    console.log("Server Running on Port " + port);
});