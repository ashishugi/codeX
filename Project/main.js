const express = require('express');
const app = express();
app.use(express.static('view'));
app.get('/',(req,res)=>{
    res.sendFile(__dirname+"/view/index.html");              
});
app.listen(3000,()=>{
    console.log('server is running on port 3000 .....'); // type localhost:3000
});