var express = require('express');
var router = express.Router();
const {insertNewUsers,loginUsers, verifyJWT} = require('../database/models/User')
const {deleteUser} = require('../database/models/Admin')

router.use((req, res, next) =>
{
    console.log('Time:', Date.now()) //Time Log
    next()
})


//router dang ki
router.post('/registerUser', async (req, res) => 
{
  res.setHeader('Access-Control-Allow-Origin', '*');
    let {name, email, password} = req.body// name = req.body.name
    console.log(name);
    
    try{
      let newUser = await insertNewUsers(name , email, password)
    
      res.json(
        {
          data: newUser,
          result : 'ok',
          message: 'Đăng kí User thành công, bạn cần mở mail để kích hoạt',
        }
      )

    }
    catch(error)
    {
      res.json(
        {
          result: 'failed',
          message: `Khong the dang ki them User. Loi: ${error}`,
          
        }
      )
    }
})


//Router dang nhap
router.post('/login', async (req, res) =>
{
  let { email, password} = req.body;
  try{
    let loginUser = await loginUsers(email,password);
    res.json(
      {
        result: 'ok',
        message: 'Dang Nhap Thanh Cong',
        tokenKey: loginUser.tokenKey,
        data: loginUser.foundUser
      }
    )

  }
  catch(error) 
  {
    res.json(
      {
        result: 'failed',
        message: `Khong the dang nhap User. Error = ${error}`,
        
      }
    )
  }
})


//Viet api block or delete router.

router.delete('/admin/DeleteUsers', async (req, res) =>
{
  let tokenKey = req.headers['x-access-token']
  let {userIds, actionType} = req.body;
  userIds = userIds.split(',') //Bien string thanh Array
  try{
    await deleteUser(userIds, tokenKey,actionType)
    res.json(
      {
       result: 'ok',
       message: 'delete user thanh cong', 
      }
    )
  }
  catch(error)
  {
    res.json(
      {
        result: 'failed',
        message: `Loi delete/block user. Error = ${error}`
      }
    )
  }

})


//api test token
//api test token key
router.get('/jwtTest', async (req, res) => 
{
    let tokenKey = req.headers['x-access-token']
    try{
        //verify token
        await verifyJWT(tokenKey);
        res.json(
          {
            result: 'ok',
            message: 'Verify Json Web Token thanh cong'
          }
        )
    }
    catch(error)
    {
      res.json(
        {
          result: 'failed',
          message: `Loi kiem tra. Error = ${error}`
        }
      )

    }
})

module.exports = router;
