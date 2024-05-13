require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const SocketServer = require('./socketServer');
const corsOptions = {
  Credential: 'true',
  
};


const app = express();

app.use(express.json())
app.options("*" , cors(corsOptions));
app.use(cors(corsOptions));
app.use(cookieParser())


//#region // !Socket
const http = require('http').createServer(app);
const io = require('socket.io')(http);



io.on('connection', socket => {
    SocketServer(socket);
})

//#endregion
const BASE = process.env.BASE_URL;
//#region // !Routes
app.get('/', (req, res) => {
  res.send('Hello, world!');
});
app.get('/api', (req, res) => {
  res.send('your api is working');
});

app.use(`/api`, require('./routes/authRouter'));
app.use(`/api`, require('./routes/userRouter'));
app.use(`/api`, require('./routes/postRouter'));
app.use(`/api`, require('./routes/commentRouter'));
app.use(`/api`, require('./routes/adminRouter'));
app.use(`/api`, require('./routes/notifyRouter'));
app.use(`/api`, require('./routes/messageRouter'));
//#endregion



const URI = process.env.MONGODB_URL;
mongoose.connect(URI, {
    useCreateIndex:true,
    useFindAndModify:false,
    useNewUrlParser:true,
    useUnifiedTopology:true
}, err => {
    if(err) throw err;
    console.log("Database Connected!!")
})

const port = process.env.PORT || 8080;
http.listen(port, () => {
  console.log("Listening on ", port);
 
});