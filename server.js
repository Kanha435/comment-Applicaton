const express = require('express');
const app = express();

// connection datababse
const conection = require("./db/conn");
const User = require('./model/userschema');
conection();

app.use(express.json());
// static middleware
app.use(express.static('public'));
const PORT = process.env.PORT || 5000;

// post from clients


app.get('/comment/apis',(req,res)=>{
    User.find()
    .then(comments => {
        res.send(comments);
    })
})

app.get("/" , (req,res)=>{
    res.sendFile(__dirname+"/index.html");
});
let server = app.listen(PORT , ()=>{
    console.log(`Your server is running on the ${PORT}`);
});
let io = require("socket.io")(server);
io.on('connection', (socket) => {
    console.log('a user Connected');
    socket.on('comment',(data)=>{
        data.time = Date();
        socket.broadcast.emit('comment',data);
        // console.log(data);
    })
    socket.on('typing' ,(data)=>{
        socket.broadcast.emit('typing',data);
    })
});

app.post('/comment/apis', (req , res)=>{
    const userData = new User({
        username : req.body.username,
        comment : req.body.comment
    })
    userData.save()
    .then((res)=> {
        console.log("Sucessfully saved");
    })
    
})