//File script nay chua ham phong 1 users thanh 1 Admin
//ham nay k viet thanh API, chay tren terminal

const {mongoose} = require('../database/databases')
const {User} = require('../database/models/User')

const makeUserBecomeAdmin = async (userIds) =>
{
    try{
        //Tim user voi id = userIds va update truong Permission

        let user = await User.findById(userIds);
        if(!user)
        {
            console.log(`Khong tim thay User voi id = ${userIds}`)
            return
        }
        user.permission = 2;
        await user.save()
        console.log(`Da phong admin cho user: ${userIds}`)

    }
    catch(error)
    {
        console.log(`Khong the update user voi UserId = ${userIds}`)
    }
}

makeUserBecomeAdmin('5c001abb2320b2291eec7f26')