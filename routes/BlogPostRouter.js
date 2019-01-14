var express = require('express');
var router = express.Router();
const {insertBlogPost, queryBlogPosts,queryBlogPostsByDateRange, getDetailBlogPost, updateBlogPost, deleteBlogPost, deleteBlogPostByAthor} = require('../database/models/BlogPost')

router.use((req, res, next) =>
{
    console.log('Time:', Date.now()) //Time Log
    next()
})
//insert newpost
router.post('/newpost', async (req, res) =>
{
    let {title, content} = req.body;
    //client phai gui token
    let tokenKey = req.headers['x-access-token']  ; 
    
    try{
        if (!tokenKey)
        {
            throw "Ban can phai dang nhap truoc"
        }
        console.log('abc')
       let newPost = await insertBlogPost(title, content, tokenKey)
        res.json(
            {
                result: 'ok',
                message: 'Them moi bai viet thanh cong',
                data: newPost
            }
        )
    }
    catch(error)
    {
       
         res.json(
             {
                 result: 'failed',
                 message: `Them moi bai viet that bai. Error = ${error}`
             }
         )
    }
})

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
    console.log(tokenKey)
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
    try{
        let deletePost = await deleteBlogPost(id, tokenKey);
        res.json(
            {
                result: 'ok',
                message: 'delete Ban ghi thanh cong',
                data: deletePost
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


module.exports = router;
