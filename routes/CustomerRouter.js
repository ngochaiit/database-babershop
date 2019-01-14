var express = require('express');
var router = express.Router();
const {insertCustomer, queryCustomer, updateCustomer, deleteCustomer} = require('../database/models/Customer');

//router insert new Customer

router.post('/insertCustomer', async (req, res) => {
    let {
        name,
        email,
        phoneNumber
    } = req.body;
    
    try {

    let newCustomer = await insertCustomer(name, email, phoneNumber);
    res.json(
        {
            result: 'ok',
            message: 'Them customer thanh cong',
            data: newCustomer
        }
    )

    } catch (error) {
        res.json(
            {
                result : 'failed',
                message: `Them moi 1 newCustomer that bai. Error = ${error}`
            }
        )

    }

})

// query 1 Customer

router.get('/queryCustomer', async (req, res) =>
{
   let  {text} = req.query;
   let tokenKey = req.headers['x-access-token']
   try
   {
    let findCustomer = await queryCustomer(text, tokenKey);
    res.json(
        {
            result: 'ok',
            message:'Query thanh cong',
            data: findCustomer
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


//update 1 customer:
router.put('/updateCustomer', async (req, res) =>
{
    let {oldname} = req.body;
    let updatedCustomer = req.body;
    let tokenKey = req.headers['x-access-token'];
    console.log('Ngoc Hai')
    console.log(oldname)
    
    try{
        let customer = await updateCustomer(oldname, updatedCustomer, tokenKey)
        res.json({
            result: 'ok',
            message: 'Update thanh cong 1 Product',
            data: customer
        })
    }
    catch(error)
    {
        res.json(
            {
                result: 'failed',
                message: `Khong update duoc product. Error = ${error}`
            }
        )
    }
})

// delete 1 customer:

router.delete('/deleteCustomer', async (req,res) =>
{
    let {id} = req.body;
    let tokenKey = req.headers['x-access-token']
    console.log(id, tokenKey)
    
    try{
        let removeCustomer = await deleteCustomer(id, tokenKey);
        res.json(
            {
                result: 'ok',
                message: 'delete Customer thanh cong',
                data: removeCustomer
            }
        )
    }
    catch(error)
    {
        res.json(
            {
                result:'failed',
                message: `Delete ban ghi that bai. Error = ${error}`
            }
        )
    }
    
})


module.exports = router;