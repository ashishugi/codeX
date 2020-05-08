var mongoose = require('mongoose');
mongoose.connect('mongodb://user:Ashish123@cluster0-shard-00-00-iev0v.mongodb.net:27017,cluster0-shard-00-01-iev0v.mongodb.net:27017,cluster0-shard-00-02-iev0v.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true} , function(err){
    if(err) throw err;
    console.log('connected');
});
var conn=mongoose.connection;
var userSchema = new mongoose.Schema({
    username:String,
    password:String,
});
var userModel =  mongoose.model('user-admin',userSchema);
module.exports=userModel;