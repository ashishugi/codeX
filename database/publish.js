var mongoose = require('mongoose');
var path='mongodb://user:Ashish123@cluster0-shard-00-00-iev0v.mongodb.net:27017,cluster0-shard-00-01-iev0v.mongodb.net:27017,cluster0-shard-00-02-iev0v.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority';
mongoose.connect(path, {useNewUrlParser: true, useUnifiedTopology: true} , function(err){
    if(err) throw err;
    console.log('connected');
});
var conn=mongoose.connection;
var problemsSchema = new mongoose.Schema({
    path:String,
    heading:String,
    description:String,
    input:String,
    output:String,
    sampleinput:String,
    sampleoutput:String,
    explanation:String,
    code:String
});