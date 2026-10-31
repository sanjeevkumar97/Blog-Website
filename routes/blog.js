const {Router}=require("express");
const multer=require('multer');
const mongoose=require('mongoose');
const Blog=require('../modles/blog');
const BlogImage=require('../modles/blogImage');
const Comment=require('../modles/comments');
const router=Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    cb(null, allowedTypes.includes(file.mimetype));
  },
});

function handleCoverImageUpload(req, res, next) {
  upload.single('coverImage')(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      const status = error.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
      return res.status(status).send(error.message);
    }
    if (error) return next(error);
    return next();
  });
}

router.get("/add-new",(req,res)=>{
    return res.render('addBlog',{
        user:req.user,
    });
})

router.get('/image/:id', async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.sendStatus(404);
    }

    const image = await BlogImage.findById(req.params.id).select('data contentType');
    if (!image) return res.sendStatus(404);

    res.set('Cache-Control', 'public, max-age=86400, immutable');
    return res.type(image.contentType).send(image.data);
});

router.get("/:id",async(req,res)=>{
    const blog=await Blog.findById(req.params.id).populate("createdBy");
     const comments=await Comment.find({blogId:req.params.id}).populate("createdBy");
    return res.render('blog',{
        user:req.user,
        blog,
        comments,
    });
})


router.post('/',handleCoverImageUpload,async(req,res)=>{
   if (!req.file) {
    return res.status(400).send('Please upload a JPEG, PNG, GIF, or WebP cover image.');
   }

   const {title,body}=req.body;
   const image = await BlogImage.create({
    data: req.file.buffer,
    contentType: req.file.mimetype,
   });
   try {
    await Blog.create({
      body,
      title,
      createdBy:req.user._id,
      coverImageId:image._id,
    });
   } catch (error) {
    await BlogImage.deleteOne({ _id: image._id });
    throw error;
   }
    return res.redirect("/");
});

router.post('/comment/:blogId',async(req,res)=>{
  const comment=await Comment.create({
    content:req.body.content,
    blogId:req.params.blogId,
    createdBy:req.user._id,
  });

  return res.redirect(`/blog/${req.params.blogId}`);
});

module.exports=router;