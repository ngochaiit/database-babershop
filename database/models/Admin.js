const{deleteBlogPostByAdmin, testFunction} = require('./BlogPost')

const {User, verifyJWT, ACTION_DELETE_USER} = require('./User')


const deleteUser = async (userIds, tokenKey, actionType) =>
{
    try{
        console.log(userIds, tokenKey, actionType)
        
        let foundUser = await verifyJWT(tokenKey);
        console.log(foundUser)
        if(foundUser.permission !== 2)
        {
            throw 'Chi co tai khoan Admin moi co chuc nang nay'

        }
        userIds.forEach( async (userId) =>
        {
            let user = await User.findById(userId);
            if(!user)
            {
                throw 'User can xoa khong ton tai'
            }
            else if(actionType = ACTION_DELETE_USER)
            {
                
                await deleteBlogPostByAdmin(userId);
                await User.findByIdAndDelete(userId);
            }
        })
    }
    catch(error)
    {
        throw error
    }
}
module.exports = {deleteUser}