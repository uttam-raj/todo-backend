require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectToMongo = require("./utils/db");
const authRouter = require('./routes/authRouter');
const todoRouter = require('./routes/todoRouter');
const settingsRoutes = require('./routes/settingsRoutes')
const errorMiddleware = require('./Middlewares/error-middleware');

const app = express();

const corsOptions = {
    origin:"https://todomeru.netlify.app/",
    methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials: true,
}
app.use(cors(corsOptions));

app.use(express.json()); //It is the midlleware while parse the json data of request body before send the response

app.use("/api/auth",authRouter);
app.use("/api/todo", todoRouter);
app.use("/api/settings",settingsRoutes);


app.use(errorMiddleware);  //It is used to handle erroer and it is a error handler middleware.

port=process.env.PORT;
connectToMongo().then(()=>{
    app.listen(port,()=>{
        console.log(`Server is running at port: ${port}`);
    })
});
