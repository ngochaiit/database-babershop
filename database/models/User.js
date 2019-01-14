const {mongoose} = require('../databases');
const bcrypt = require('bcryptjs');
const {Schema} = mongoose
const jwt = require('jsonwebtoken')
const secretString = "cung cap token"
const ACTION_DELETE_USER = 'ACTION_DELETE_USER'
// const {deleteBlogPostbyAdmin} = require('./BlogPost')
//cau truc 1 collection
const UserSchema = new Schema(
    {
        //Schema: cau truc cua 1 collection.
        name: {type: String, default: 'unknown', unique: true},   //unique khong dc phep insert 2 u ser giong het nhau
        email: {type: String, match:/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, unique: true},
        password: {type: String, require: true},    
        active: {type: Number, default: 0}, //inactive  
        permission: {type: Number, default: 0},// 0: user, 1: moderator, 2: admin
        //truong tham chieu
        BlogPosts: [{type: mongoose.Schema.Types.ObjectId, ref: 'BlogPost'}],
        ProductPosts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Product'}]
        
        
         
    }
)


//tao collection moi
const  User = mongoose.model('User',UserSchema);

//insert new users:

const insertNewUsers = async (name, email, password) => {
    try {
    	//Mã hoá password trước khi lưu vào DB
	    const encryptedPassword = await bcrypt.hash(password, 10)//saltRounds = 10
        const newUser = new User()
        newUser.name = name
        newUser.email = email
        newUser.password = encryptedPassword 
             
        await newUser.save()
        console.log(newUser)
        return newUser; 
        
    }
     catch(error) {
        //Tự tuỳ chỉnh lại Error
        if (error.code === 11000) {
        	throw "Tên hoặc email đã tồn tại fucking idiot"
        }
        //throw error
    }
}

//login

const loginUsers = async (email, password) =>
{
 try{
   
    let foundUser = await User.findOne({email: email.trim()}).exec()
    
if(!foundUser)
{
    throw "User Khong ton tai"
}

let encryptedPassword = foundUser.password
let checkPassword = await bcrypt.compare(password, encryptedPassword)
if(checkPassword === true)
{
    //Dang nhap thanh cong
    let jsonObject = {
        id: foundUser._id
    }
    let tokenKey = await jwt.sign(jsonObject,secretString,{expiresIn: 86400})// expiresIn: 86400  = expires trong 24h
    
    return {tokenKey, foundUser};
}
else
{
    throw 'Ban nhap sai password roi'
}
 }
 catch(error)
 {
    throw (error)
 }

}

// verifyJWT 1 tocken
const verifyJWT = async (tokenKey) => {
    try {          
        let decodedJson = await jwt.verify(tokenKey, secretString)
        console.log(decodedJson)
        if(Date.now() / 1000 >  decodedJson.exp) {
            throw "Token hết hạn, mời bạn login lại"
        }
        let foundUser = await User.findById(decodedJson.id)
        if (!foundUser) {
            throw "Ko tìm thấy user với token này"
        }
        console.log(foundUser)
        return foundUser
    } catch(error) {
        throw error
    }                 
}


            



//Ham ranh rieng cho Admin. Delete User
// const deleteUser = async (userIds, tokenKey, actionType) =>
// {
//     try{
//         let foundUser = verifyJWT(tokenKey);
//     if(!foundUser.permission !== 2)
//     {
//         throw 'Chi co tai khoan Admin moi co chuc nang nay'
//     }
//     userIds.foreach( async (userId) =>
//         {
//             let user = await User.findById(userId)
//             if(!user)
//             {
//                 return
//             }
//             //thuc hien cac hanh dong delete, update or....
//             if(actionType = ACTION_DELETE_USER)
//             {
//                 await  deleteBlogPostbyAdmin(userId)
//                 await User.findByIdAndDelete(userId)
//             }

//         })

//     }
//     catch(error)
//     {
//         throw error;
//     }


// }



module.exports = {User, insertNewUsers, loginUsers, verifyJWT, ACTION_DELETE_USER }