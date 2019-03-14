var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');
const {insertBlogPost, queryBlogPosts,queryBlogPostsByDateRange, getDetailBlogPost, updateBlogPost, deleteBlogPost, deleteBlogPostByAthor,showAllBlogpost} = require('../database/models/BlogPost')

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../public/images'))
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname )
    }
  });
var upload = multer({storage: storage});

router.use((req, res, next) =>
{
    console.log('Time:', Date.now()) //Time Log
    next()
})
//insert newpost
router.post('/newpost', upload.single('urlImage'),async (req, res, next) => {
    try{
      let {title,intro,content} = req.body;
     
      let url =   req.file.filename;
        console.log(url);

      let tokenKey = req.headers['x-access-token']  ; 
      let newPost = await insertBlogPost(title,intro,content,url,tokenKey)
      
      res.json(
        {
            result: 'ok',
            message: 'Them moi bai viet thanh cong',
            data: newPost
        }
      )     
    }
    catch(error) {
      res.json(
        {
            result: 'failed',
            message: `Them moi bai viet that bai. Error = ${error}`
        }
      )
    }
  
  
  });

// Tim BlogPost trong danh sach

router.get('/queryBlogPost', async (req, res) =>
{
   let  {text} = req.query;
   try
   {
    let findBlogPost = await queryBlogPosts(text);
    res.json(
        {
            result: 'ok',
            message:'Query thanh cong',
            data: findBlogPost
        }
    )
   }
   catch(error)
   {
    res.json(
        {
            result: 'failed',
            message: `Query that bai. Error = ${error}`
        }
    )
   }
})

router.get('/showallpost', async (req, res) =>
{
    try
    {
        let blogposts = await showAllBlogpost();
        res.json(
            {
                result: 'ok',
                message:'Danh sach BlogPost',
                data: blogposts
            }
        )
    }
    catch(error)
    {
        res.json(
        {
            result: 'failed',
            message:`Show blogPost that bai. Error = ${error}`
        })
    }
})


// tim BlogPost theo ngay thang
router.get('/getQueryBlogPostByDateRange', async (req, res) =>
{
    let {from, to} = req.query;

    try{
        console.log('dumb');
        let blogPosts = await queryBlogPostsByDateRange(from, to);
        res.json(
            {
                result: "ok",
                message: "Query thanh cong. Duoi day la danh sach",
                data: blogPosts
            }
        )
    }
    catch(error)
    {
        res.json(
            {
                result:'failed',
                message: `Query khong thanh cong. Error = ${error}`
            }
        )

    }
})
//router lay chi tiet 1 bai BlogPost

router.get('/detailBlogPost', async (req,res) =>
{
    let {id} = req.query;
    try
    {
        let detailBlogPost = await getDetailBlogPost(id);
        res.json(
            {
                result: 'ok',
                message: 'Query detailBlogPost thanh cong',
                data: detailBlogPost,
            }
        )
    }
    catch(error)
    {
        res.json(
            {
                result: 'failed',
                message: `query detail Blogpost that bai. Error = ${error}`
            }
        )

    }
})
//API update 1 bai post using token

router.put('/update', async (req, res) =>
{
    let{id} = req.body;
    let updatedBlogPost = req.body;
    let tokenKey = req.headers['x-access-token']
    console.log(id)
    try{
        let blogPost = await updateBlogPost(id, updatedBlogPost, tokenKey)
        res.json({
            result: 'ok',
            message: 'Update thanh cong 1 BlogPost',
            data: blogPost
        })
    }
    catch(error)
    {
        res.json(
            {
                result: 'failed',
                message: `Khong update duoc BlogPost. Error = ${error}`
            }
        )
    }
})

//api delete 1 baiBlogPost

router.delete('/delete', async (req,res) =>
{
    let {id} = req.body;
    let tokenKey = req.headers['x-access-token']
    console.log(tokenKey, id, '1234')
    try{
        await deleteBlogPost(id, tokenKey);
        res.json(
            {
                result: 'ok',
                message: 'delete Ban ghi thanh cong',
            }
        )
    }
    catch(error)
    {
        res.json(
            {
                result:'ok',
                message: `Delete ban ghi that bai. Error = ${error}`
            }
        )
    }
    
})

//API delete toan bo bai viet cua 1 tac gia

router.delete('/deleteByAuthor', async (req, res) =>
{
    let {id} = req.body;
    let tokenKey = req.headers['x-access-token']
    try{
      let users =  await deleteBlogPostByAthor(id, tokenKey)
        res.json(
            {
                result: 'ok',
                message: 'Delete Toan bo bai viet thanh cong',
                data: users
                

            }
        )
    }
    catch(error)
    {
        res.json(
            {
                result: 'failed',
                message: `Delete bai viet cua tac gia that bai. Error = ${error}`
            }
        )
    }
})

router.get('/sendfile/:image', async (req, res) =>
{
    try{
        let {image} = req.params;
        console.log(image)
        let url = '/media/ngochai/Study/project techmaster/HairHeavenDatabases';
    await res.sendFile(path.join(url +'/public/images/'+ image)); 
    }
    catch(error)
    {
        res.json(
            {
                result: 'failed',
                message: `Tai anh that bai. Error - ${error}`
            }
        )
    }
})


module.exports = router;
