var express = require('express');
var router = express.Router();
const {insertAppointment,deleteAppointment} = require('../database/models/Appointment')



//router insert new Appointment

router.post('/book', async (req, res) => {
    let {
        phoneNumber,
        timeAt,
    } = req.body;
    
    try {

    let newBook = await insertAppointment(phoneNumber, timeAt);
    res.json(
        {
            result: 'ok',
            message: 'Dat lich hen  thanh cong',
            data: newBook
        }
    )

    } catch (error) {
        res.json(
            {
                result : 'failed',
                message: `Dat lich hen  that bai. Error = ${error}`
            }
        )

    }

})

router.delete('/removeBook', async (req,res) =>
{
    let {id} = req.body;
    console.log(id)
    try{
    let removeBook = await deleteAppointment(id);
    res.json(
        {
            result: 'ok',
            message: 'xoa lich hen da book thanh cong'
        }
    )
    }
    catch(error)
    {
        res.json(
            {
                result: 'failed',
                message: `xoa lich hen that bai. Error = ${error}`
            }
        )
    }
})

module.exports = router;