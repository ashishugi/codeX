const express = require('express');
const app = express();
app.set('view engine','ejs');
app.set('views','./view/pages');
app.get('/',(req,res)=>{
    res.render('index');
});
app.get('/about',(req,res)=>{
    res.render('about');
});
app.listen(3000,()=>{
    console.log('server is running on port 3000 .....'); // type localhost:3000
});