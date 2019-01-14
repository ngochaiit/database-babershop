const {mongoose} = require('../databases');
const {Schema} = mongoose;
const{verifyJWT} = require('./User')

const CustomerSchema = new Schema(
    {
        name: {type: String, default: 'unknown', unique: true},
        email: {type: String, match:/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, unique: true},
        phoneNumber: {type: String, default: 'unknown'},
        //Truong tham chieu. 1 Customer co the mua nhieu Product
        cart:[{type: mongoose.Schema.Types.ObjectId, ref: 'Product'}]
    }
)
//Tao 1 collection moi:
const Customer = mongoose.model('Customer', CustomerSchema);

// cac ham API
//api insert new Customer into database

const insertCustomer = async (name, email, phoneNumber) =>
{
   try{
    let newCustomer = await Customer.create(
        {
            name,
            email, 
            phoneNumber
        }
    )

    await newCustomer.save();

   
    return newCustomer
   }
   catch(error)
   {
    throw error;
   }

}

//api query 1 Customer
const queryCustomer = async (text, tokenKey) =>
{
    try{
        let signedUser = await verifyJWT(tokenKey)
        if(!signedUser)
        {
            throw " Yeu cau dang nhap tai khoan truoc khi query"
        }
        const customer = await Customer.find(
            {
                $or: [
                    {
                        name: new RegExp(text, "i")
                        //i => Khong phan biet hoa thuong
                    },
                    {
                        phoneNumber: new RegExp(text, "i")
                    }
                ]
            }
        )
        if(!customer)
        {
            throw "Khong ton tai "
        }

        return  customer
    }
    catch(error)
    {
        throw error;
    }
}

//router update thong tin 1 Customer:

const updateCustomer = async (keyword, updatedCustomer, tokenKey) =>
{
    try{
        
        const signedUser = await verifyJWT(tokenKey);
        if(!signedUser)
        {
            throw " yeu cau dang nhap tai khoan truoc khi update thong tin khach hang"
        }
        
        let editCustomer = await Customer.findOne({name : keyword})
        if(!editCustomer)
        {
            throw `Khong tim duoc customer voi ten la la: ${keyword}`
        }
    editCustomer.name = !updatedCustomer.name ? editCustomer.name : updatedCustomer.name
    editCustomer.email = !updatedCustomer.email ? editCustomer.email : updatedCustomer.email
    editCustomer.phoneNumber = !updatedCustomer.phoneNumber ? editCustomer.phoneNumber : updatedCustomer.phoneNumber
    
    editCustomer.save();
    return editCustomer
   
    }
    catch(error)
    {
        throw error
    }
}

//api delete 1 customer:
const deleteCustomer = async (customerId,tokenKey) =>
{
    try{
        let signedInUser = await verifyJWT(tokenKey);// tra ve 1 users
        let foundCustomer = await Customer.findById(customerId);// tim blogpost

        if(!foundCustomer)
        {
            throw ` Khong tim duoc bai viet co ID la: ${customerId}`
        }
        

        await Customer.deleteOne({_id: customerId});//xoa customer khoi database

    }
    catch(error)
    {
        throw error
    }

}



module.exports = {Customer, insertCustomer, queryCustomer, updateCustomer, deleteCustomer}
