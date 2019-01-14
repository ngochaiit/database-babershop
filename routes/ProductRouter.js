var express = require('express');
var router = express.Router();
const {
    insertNewProduct,
    queryProduct,
    getDetailProduct,
    updateProduct,
    deleteProduct
} = require('../database/models/Product')

router.use((req, res, next) => {
    console.log('Time:', Date.now()) //Time Log
    next()
})

//router insert new Product

router.post('/insertProduct', async (req, res) => {
    let {
        name,
        description,
        price,
        imgURL
    } = req.body;
    let tokenKey = req.headers['x-access-token'];
    console.log(name, imgURL);
    try {
        if (!tokenKey) {
            throw "Ban can phai dang nhap truoc"
        }

    let newProduct = await insertNewProduct(name, description, price, imgURL, tokenKey);
    res.json(
        {
            result: 'ok',
            message: 'Them moi 1 san pham thanh cong',
            data: newProduct
        }
    )

    } catch (error) {
        res.json(
            {
                result : 'failed',
                message: `Them moi Product that bai. Error = ${error}`
            }
        )

    }

})

// xem danh sach cac product:
router.get('/queryProducts', async (req, res) =>
{
   let  {text} = req.query;
   try
   {
    let findProduct = await queryProduct(text);
    res.json(
        {
            result: 'ok',
            message:'Query thanh cong',
            data: findProduct
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

//router get detail cua 1 product:
router.get('/detailProduct', async (req,res) =>
{
    let {id} = req.query;
    try
    {
        let detailProduct = await getDetailProduct(id);
        res.json(
            {
                result: 'ok',
                message: 'Query detailProduct thanh cong',
                data:  detailProduct,
            }
        )
    }
    catch(error)
    {
        res.json(
            {
                result: 'failed',
                message: `query detail Product that bai. Error = ${error}`
            }
        )

    }
})

//router update 1 Product:
router.put('/updateProduct', async (req, res) =>
{
    let{id} = req.body;
    let updatedProduct = req.body;
    let tokenKey = req.headers['x-access-token']
    
    try{
        let Product = await updateProduct(id, updatedProduct, tokenKey)
        res.json({
            result: 'ok',
            message: 'Update thanh cong 1 Product',
            data: Product
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

//router deleteProduct

router.delete('/deleteProduct', async (req,res) =>
{
    let {id} = req.body;
    let tokenKey = req.headers['x-access-token']
    console.log('dumb', id)
    try{
        let removeProduct = await deleteProduct(id, tokenKey);
        res.json(
            {
                result: 'ok',
                message: 'delete Product thanh cong',
                data: removeProduct
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

module.exports = router;