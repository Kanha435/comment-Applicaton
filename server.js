const express = require('express');
const app = express();

// static middleware
app.use(express.static('public'));
const PORT = process.env.PORT || 5000;



app.listen(PORT , ()=>{
    console.log(`Your server is running on the ${PORT}`);
})