const {mongoose} = require('../databases');
const {Schema} = mongoose;

const AppointmentSchema = new Schema(
    {
        phoneNumber: {type: String, default: 'unknow'},
        timeAt: {type: String, default: ''},
        

    }
)

const Appointment =  mongoose.model('Appointment', AppointmentSchema );
// insert new Appointment
const insertAppointment = async (phoneNumber, timeAt) =>
{
   try{
    let newAppointment = await Appointment.create(
        {
            phoneNumber,
            timeAt
        }
    )

    await newAppointment.save();
   
    return newAppointment;
   }
   catch(error)
   {
    throw error;
   }

}

const deleteAppointment =  async (appointmentId) =>
{
    console.log(appointmentId)
    try
    {
         await Appointment.findByIdAndDelete(appointmentId);
       
    }
    catch(error)
    {
        throw error
    }
}

module.exports = {Appointment, insertAppointment, deleteAppointment}