const {mongoose} = require('../databases');
const {Schema} = mongoose;
const{verifyJWT} = require('./User')
var fs = require('fs');

// tao schema. 1 Product thi co 1 User
const ProductSchema = new Schema(
    {
        name: {type: String, default: 'unknown', unique: true},
        description: {type: String, default: ''},
        price: {type: Number, default: 0},
        quantity: {type: Number, default: 0},
        imgURL: {type: String},
        createdAt: {type: Date, default: Date.now},
        updatedAt: {type: Date, default: Date.now},
        //Truong tham chieu, 1 product do 1 user post 
        userPost:{type: mongoose.Schema.Types.ObjectId, ref: "User"}
    }
)

//Tao 1 collection moi
const Product = mongoose.model('Product', ProductSchema);

//api insert new Product
const insertNewProduct = async (name, description, price, imgURL, tokenKey) =>
{
   try{
    let checkUserLogin = await verifyJWT(tokenKey);
    if(!checkUserLogin)
    {
        throw "Ban phai dang nhap de dang san pham"
    }

    let newProduct = await Product.create(
        {
            name, description, price, imgURL, quantity,
            createdAt: Date.now(),
            userPost: checkUserLogin
        }
    )

    await newProduct.save();
    await checkUserLogin.ProductPosts.push(newProduct);
    await checkUserLogin.save()
    return newProduct
   }
   catch(error)
   {
    throw error;
   }

}

const queryProduct = async (text) =>
{
    try{
        const products = await Product.find(
            {
                $or: [
                    {
                        name: new RegExp(text, "i")
                        //i => Khong phan biet hoa thuong
                    },
                    {
                        description: new RegExp(text, "i")
                    }
                ]
            }
        )
        if(!products)
        {
            throw "Khong ton tai "
        }

        return  products
    }
    catch(error)
    {
        throw error;
    }
}
//Api lay noi dung chi tiet cua 1 Product:

const getDetailProduct = async (productId) =>
{
    try{
        let product = await Product.findById(productId)
        if(!product)
        {
            throw `Khong tim thay Product voi ID = ${productId}`
        }
        return product

    }
    catch(error)
    {
        throw error;
    }
}
//api update 1 Product using token:

const updateProduct = async (productId, updatedProduct, tokenKey) =>
{
    try{
        
        const signedUser = await verifyJWT(tokenKey);
        
        let editProduct = await Product.findById(productId);
        if(!editProduct)
        {
            throw `Khong tim duoc Product voi ID la: ${productId}`
        }
    if(signedUser.id !== editProduct.userPost.toString())
    {
        throw "Khong update duoc vi ban khong phai la tac gia cua bai viet"
    }
    editProduct.name = !updatedProduct.name ? editProduct.name : updatedProduct.name
    editProduct.description = !updatedProduct.description ? editProduct.description : updatedProduct.description
    editProduct.price = !updatedProduct.price ? editProduct.price : updatedProduct.price
    editProduct.imgURL = !updatedProduct.imgURL ? editProduct.imgURL : updatedProduct.imgURL
    editProduct.updatedAt = Date.now()
    await editProduct.save()
    return editProduct
    }
    catch(error)
    {
        throw error
    }
}


//Api delete 1 product:
const deleteProduct = async (productId,tokenKey) =>
{
    try{
        let signedInUser = await verifyJWT(tokenKey);// tra ve 1 users
        let foundProduct = await Product.findById(productId);// tim blogpost

        if(!foundProduct)
        {
            throw ` Khong tim duoc bai viet co ID la: ${productId}`
        }
        if(signedInUser.id !== foundProduct.userPost.toString() )
        {
            throw 'Ban Khong co quyen xoa vi khong so huu ban quyen'
        }

        await Product.deleteOne({_id: productId});//xoa blogpost do
        signedInUser.ProductPosts = await signedInUser.ProductPosts.filter(eachProduct =>
            {
                return foundProduct._id.toString() !== eachProduct._id.toString()
            })

        await signedInUser.save()
        return signedInUser
    }
    catch(error)
    {
        throw error
    }

}


module.exports = {Product, insertNewProduct, queryProduct, getDetailProduct, updateProduct, deleteProduct}
