var express = require('express');
var router = express.Router();
var problemModel =require('../database/problem');
var problem = problemModel.find({});
var bcrypt = require('bcryptjs');
var userModel = require('../database/user');
var blogsModel = require('../database/blogs');
var blogs = blogsModel.find({}).sort({ $natural: -1 });


var jwt=require('jsonwebtoken'); // includeing json web token
if (typeof localStorage === "undefined" || localStorage === null) { // including the node-localstorge package
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}



/* GET home page. */
router.get('/', function(req, res, next) {
  var loginuser = localStorage.getItem('loginUser');
  if(loginuser){
    res.render('index', { title: 'Express' ,loginuser:loginuser});
  }else{
    res.render('index', { title: 'Express',loginuser:'' });
  }
 
});


module.exports = router;
// router.get('/nav',(req,res,next)=>{
//   res.render('nav');
// });
router.get('/',(req,res)=>{
  var loginuser = localStorage.getItem('loginUser');
  if(loginuser){
    res.render('index',{loginuser:loginuser});
  }else{
    res.render('index',{loginuser:''});
  }
});
router.get('/index',(req,res,next)=>{
  var loginuser = localStorage.getItem('loginUser');
  if(loginuser){
    res.render('index',{loginuser:loginuser});
  }else{
    res.render('index',{loginuser:''});
  }
});
router.get('/design',(req,res)=>{
  var loginuser = localStorage.getItem('loginUser');
  if(loginuser){
    res.render('design',{loginuser:loginuser});
  }else{
    res.render('index',{loginuser:''});
  }
});
router.post('/design',async(req,res)=>{
  var loginuser = localStorage.getItem('loginUser');
  if(loginuser){
      var setpath="";
    for(var i=0;i<req.body.heading.length;i++){
       if(req.body.heading[i]!=' '){
            setpath=setpath+req.body.heading[i].toLowerCase();
        }else{
           setpath=setpath+'-';
        }
    }
  //conn.on('error',console.error.bind(console,"connection error"));
    var question = new problemModel({
       path:setpath,
        heading:req.body.heading,
        description:req.body.description,
        input:req.body.input,
        output:req.body.output,
        sampleinput:req.body.sampleinput,
        sampleoutput:req.body.sampleoutput,
        explanation:req.body.explanation,
        code:req.body.code
    });
  // await conn.collection('problems').insertOne(question,(err, collection)=>{
  //     if (err) throw err;
  //     console.log("Record inserted Successfully");
      
  // });
    question.save(function(err,data){
      if(err) throw err;
      console.log("Inserted");
    });
    res.render('index',{loginuser:loginuser});
  }
 
});






router.get('/problems',(req,res,next)=>{
  var loginuser = localStorage.getItem('loginUser');
  if(loginuser){
    problem.exec(function(err,data){
      if(err) throw err;
      res.render('problems',{tittle:"Questions",record:data,loginuser:loginuser});
    });
  }else{
    problem.exec(function(err,data){
      if(err) throw err;
      res.render('problems',{tittle:"Questions",record:data,loginuser:''});
    });
  }
});


router.get('/about',(req,res)=>{
  var loginuser = localStorage.getItem('loginUser');
  if(loginuser){
    res.render('about',{loginuser:loginuser});
  }else{
    res.render('about',{loginuser:''});
  }
});


router.get('/problems/:path', async (req, res) => {
  var loginuser = localStorage.getItem('loginUser');
  if(loginuser){
    const { path } = req.params; // Equal to "const path = req.params.path"

    try {
      const data = await problemModel.find({ path: path });
      if(data.length>0){
        res.render('publish', { record: data[0],loginuser:loginuser }); 
      }else{
        res.send('<h1>404</h1>');
      }
    } catch (e) {
      res.redirect('index');
    }
  }else{
    const { path } = req.params; // Equal to "const path = req.params.path"

    try {
      const data = await problemModel.find({ path: path });
      console.log(data);
      if(data.length>0){
        res.render('publish', { record: data[0],loginuser:'' });
      }else{
        res.send('<h1>404</h1>');
      }
    } catch (e) {
      res.render('index');
    }

  }
});
router.get('/problems/del/:id', (req, res) => { // deletion of Problems
  var loginuser = localStorage.getItem('loginUser');
  if(loginuser){
    var problem_id = req.params.id;
    var del = problemModel.findByIdAndDelete(problem_id);
    del.exec((err,data)=>{
      if(err) throw err;
      res.redirect('/problems');
    });
  }
});





router.get('/login',function(req,res,next){
  var loginuser = localStorage.getItem('loginUser');
  if(loginuser){
    res.render('index',{msg:'',loginuser:loginuser});
  }else{
    res.render('login',{msg:'',loginuser:''});
  }
});
router.post('/login',function(req,res,next){
  var username = req.body.username;
  var userpass = req.body.password;
  var check_user = userModel.findOne({username:username});
  check_user.exec((err,data)=>{
    console.log("Inside the exec"+data);
    if(data == null){
      res.redirect('login');
    }else{
      if(err) throw err;
      var getuserid = data._id;
      var getpassword = data.password;
      if(getpassword == userpass){
        var token = jwt.sign({userID:getuserid},'loginToken');
        localStorage.setItem('userToken',token); 
        localStorage.setItem('loginUser',username);
        res.redirect('index');
      }else{
        console.log("reaching in else part");
        res.redirect('login');
      }
    }
  });
  
});


/*********************** Design Blogs ******************/
router.get('/designBlog',function(req,res,next){
  var loginuser = localStorage.getItem('loginUser');
  if(loginuser){
    res.render('designBlog',{loginuser:loginuser});
  }else{
    res.render('designBlog',{loginuser:''});
  }
});
router.post('/designBlog',function(req,res,next){
  var loginuser = localStorage.getItem('loginUser');
  if(loginuser){
    var getpath="";
    for(var i=0;i<req.body.blog_heading.length;i++){
      if(req.body.blog_heading[i]!=' '){
        getpath=getpath+req.body.blog_heading[i].toLowerCase();
      }else{
        getpath=getpath+"-";
      }
    }
    var gettitle = req.body.blog_title;
    var getheading  = req.body.blog_heading;
    var getcontent = req.body.blog_content;
    var getauthor = req.body.blog_author;
    
    var blog = new blogsModel({
      path:getpath,
      author:getauthor,
      title:gettitle,
      heading:getheading,
      content:getcontent,
    });
    blog.save(function(err,data){
      if(err) throw err;
      console.log('INserted');
      res.redirect('blogs');
    });
  }
});
/**************************** Blogs  **************************/
router.get('/blogs',function(req,res,next){
  var loginuser = localStorage.getItem('loginUser');
  if(loginuser){
    blogs.exec(function(err,data){
      if(err) throw err;
      res.render('blogs',{records:data,loginuser:loginuser});
    });
  }else{
    blogs.exec(function(err,data){
      if(err) throw err;
      res.render('blogs',{records:data,loginuser:''});
    });
  }
    
});
// deletion of the blogs
router.get('/blogs/del/:id',function(req,res,next){
  var blog_id = req.params.id;
  var blog_del = blogsModel.findByIdAndDelete(blog_id);
  blog_del.exec(function(err,data){
    if(err) throw err;
    res.redirect('/blogs');
  });
    
});
router.get('/blogs/:path?',async (req,res,next)=>{ // publish the blog
  //   var blog_path = req.params.path;
  //   var blog_find = blogsModel.findById({path:blog_path});
  //   console.log(blog_path);
  //  blog_find.exec(function(err,data){
  //     if(err) throw err;
  //     console.log(data);
  //     res.render('/publishBlog',{title:data.title,heading:data.heading,content:data.content});
  //   });
  var loginuser = localStorage.getItem('loginUser');
  if(loginuser){
    const { path } = req.params; // Equal to "const path = req.params.path"

    try {
      const data = await blogsModel.find({ path: path });
      
      
      if(data.length > 0){
        res.render('publishBlog', { record: data[0],loginuser:loginuser });
      }else{
        res.send('<h1>404</h1>')
      }
    } catch (e) {
      res.render('path-to-error-page');
    }
  }else{
    const { path } = req.params; // Equal to "const path = req.params.path"

    try {
      const data = await blogsModel.find({ path: path });
     
      if(data.length > 0){
        res.render('publishBlog', { record: data[0] ,loginuser:''});
      }else{
        res.send('<h1>404</h1>')
      }
    } catch (e) {
      res.render('path-to-error-page');
    }
  }
});

// logout
router.get('/logout', function(req, res, next) {
  var loginuser = localStorage.getItem('loginUser');
  if(loginuser){
    localStorage.removeItem('userToken'); // we are removing both the setItem to local disks , so we remove both the items
    localStorage.removeItem('loginUser');
     res.redirect('index');
  }else{
    res.redirect('index');
  }
  
});


router.get('/courses', function(req, res){
  var loginuser = localStorage.getItem('loginUser');
  if(loginuser){
    res.render('courses',{loginuser:loginuser});
  }else{
    res.render('courses',{loginuser:''});
  }
});
//this is for the 404 page
router.get('*', function(req, res){
  var loginuser = localStorage.getItem('loginUser');
  if(loginuser){
    res.render('404',{loginuser:loginuser});
  }else{
    res.render('404',{loginuser:''});
  }
});
router.get('/problems/*', function(req, res){
  var loginuser = localStorage.getItem('loginUser');
  if(loginuser){
    res.render('404',{loginuser:loginuser});
  }else{
    res.render('404',{loginuser:''});
  }
});
router.get('404', function(req, res){
  var loginuser = localStorage.getItem('loginUser');
  if(loginuser){
    res.render('404',{loginuser:loginuser});
  }else{
    res.render('404',{loginuser:''});
  }
});
