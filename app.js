require("dotenv").config();

const express=require('express');
const path=require('path');
const cookieParser=require("cookie-parser");
const app=express();

const PORT=process.env.PORT || 8000;
const mongoose=require('mongoose');
const userRoute=require('./routes/user');
const blogRoute=require('./routes/blog');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');
const Blog=require('./modles/blog');

mongoose.connect(process.env.MONGO_URL).then((e)=>console.log("mongoDB connected"));

app.set('view engine','ejs');
app.set("views",path.resolve("./views"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.resolve("./public")));

app.use(checkForAuthenticationCookie("token"));
app.use('/user',userRoute);
app.use('/blog',blogRoute);

app.get("/",async(req,res)=>{
    const AllBlogs=await Blog.find({});
    return res.render('home',{
        user:req.user,
        blogs:AllBlogs,
    });
})


app.listen(PORT,()=>console.log(`server started at PORT${PORT} `));

