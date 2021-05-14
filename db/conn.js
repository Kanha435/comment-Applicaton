const mongoose = require('mongoose');

const conection = ()=>{
    mongoose.connect('mongodb://localhost:27017/Comment',{
        useNewUrlParser:true,
        useUnifiedTopology:true,
        useFindAndModify:true
    });
    const connecton = mongoose.connection
    connecton.once('open',()=>{
        console.log("Server is connected with database ");
    }).catch((err) =>{
        console.log("Some error in Server");
    })
}

module.exports = conection;
