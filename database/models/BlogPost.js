const {mongoose} = require('../databases')
const {Schema} = mongoose
const {verifyJWT} = require('./User')


const BlogPostSchema = new Schema({
    title: {type: String, default: 'unknown', unique: true},
    content: {type: String, default: ''},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
    //Trường tham chiếu, 1 blogpost do 1 người viết
    author:{type: mongoose.Schema.Types.ObjectId, ref: "User"}
})
//quan he 1 user - nhieu bai post

//Chuyen tu schema sang  collection
const BlogPost = mongoose.model('BlogPost', BlogPostSchema);

//api insert blogPost

const insertBlogPost = async (title, content, tokenKey) =>
{
   try{

    let signedUser = await verifyJWT(tokenKey);
    console.log(signedUser)
    if(!signedUser)
    {
        throw "Lam on dang nhap de dang bai viet"
    }
    let newBlogPost = await BlogPost.create(
        {
            title, content,
            createdAt: Date.now(),
            author: signedUser
        }
    )
    await newBlogPost.save(),
    await signedUser.BlogPosts.push(newBlogPost);
    await signedUser.save()
    return newBlogPost

   }
   catch(error)
   {
    throw error
   }

}

// Muon xem danh sach toan bo cac blogPOst, khong can token

const queryBlogPosts = async (text) =>
{
    try{
        const blogPosts = await BlogPost.find(
            {
                $or: [
                    {
                        title: new RegExp(text, "i")
                        //i => Khong phan biet hoa thuong
                    },
                    {
                        content: new RegExp(text, "i")
                    }
                ]
            }
        )
        if(!blogPosts)
        {
            throw "Khong ton tai "
        }

    console.log(blogPosts)

        return blogPosts
    }
    catch(error)
    {
        throw error;
    }
}

//query BlogPost theo danh sach ngay thang

const queryBlogPostsByDateRange = async (from, to) =>
{
    //format: xx - yy- zzzz
    console.log(from);
    let fromDate = new Date(parseInt(from.split('-')[2]), 
                            parseInt(from.split('-')[1])-1, 
                            parseInt(from.split('-')[0]))
    let toDate = new Date(parseInt(to.split('-')[2]), 
                            parseInt(to.split('-')[1])-1, 
                            parseInt(to.split('-')[0])) 
    console.log(to);
    try{

        let blogPosts = await BlogPost.find(
            {
                createdAt: {$gte: fromDate, $lt: toDate}
            }
        )
        return blogPosts
    }
    catch(error)
    {
        throw error
    }
}
//Api lay noi dung chi tiet cua 1 bai post:
const getDetailBlogPost = async (blogPostId) =>
{
    try{
        let blogPost = await BlogPost.findById(blogPostId)
        if(!blogPost)
        {
            throw `Khong tim thay BlogPost voi ID = ${blogPostId}`
        }
        return blogPost

    }
    catch(error)
    {
        throw error;
    }
}

//API update post using token:
const updateBlogPost = async (blogPostId, updatedBlogPost, tokenKey) =>
{
    try{
        
        const signedUser = await verifyJWT(tokenKey);
        console.log(signedUser);
        let editBlogPost = await BlogPost.findById(blogPostId);
        if(!editBlogPost)
        {
            throw `Khong tim duoc editBlogPost voi ID la: ${blogPostId}`
        }
    if(signedUser.id !== editBlogPost.author.toString())
    {
        throw "Khong update duoc vi ban khong phai la tac gia cua bai viet"
    }
    editBlogPost.title = !updatedBlogPost.title ? editBlogPost.title : updatedBlogPost.title
    editBlogPost.content = !updatedBlogPost.content ? editBlogPost.content : updatedBlogPost.content
    editBlogPost.updatedAt = Date.now()
    await editBlogPost.save()
    return editBlogPost
    }
    catch(error)
    {
        throw error
    }
}


//API delete 1 bai blogPost 
const deleteBlogPost = async (blogPostId,tokenKey) =>
{
    try{
        let signedInUser = await verifyJWT(tokenKey);// tra ve 1 users
        let foundBlogPost = await BlogPost.findById(blogPostId);// tim blogpost

        if(!foundBlogPost)
        {
            throw ` Khong tim duoc bai viet co ID la: ${blogPostId}`
        }
        if(signedInUser.id !== foundBlogPost.author.toString() )
        {
            throw 'Ban Khong co quyen xoa vi khong so huu ban quyen'
        }

        await BlogPost.deleteOne({_id: blogPostId});//xoa blogpost do
        signedInUser.BlogPosts = await signedInUser.BlogPosts.filter(eachBlogPost =>
            {
                return foundBlogPost._id.toString() !== eachBlogPost._id.toString()
            })

        await signedInUser.save()
        return signedInUser
    }
    catch(error)
    {
        throw error
    }

}

//API delete toan bo bai viet cua 1 tac gia

const deleteBlogPostByAthor = async (authorId,tokenKey) =>
{
    try{
        let signedInUser = await verifyJWT(tokenKey);// tra ve 1 users
        let foundBlogPost = await BlogPost.find({author: authorId})

        console.log(foundBlogPost)
       await BlogPost.deleteMany({author: authorId})
       console.log(signedInUser.BlogPosts.length)
       let number = signedInUser.BlogPosts.length
       console.log(number)
       
     signedInUser.BlogPost  = await signedInUser.BlogPosts.splice(0, number)

        await signedInUser.save()
        return signedInUser
    }
    catch(error)
    {
        throw error
    }

}

const deleteBlogPostByAdmin = async (userId) =>
{
    try{
        await BlogPost.deleteMany({author: userId})
    }
    catch(error)
    {
        throw error
    }
}

const testFunction = async (text) =>
{
    console.log(text)
}
module.exports ={BlogPost, insertBlogPost,queryBlogPosts, queryBlogPostsByDateRange,getDetailBlogPost, updateBlogPost,deleteBlogPost, deleteBlogPostByAthor,deleteBlogPostByAdmin, testFunction}
