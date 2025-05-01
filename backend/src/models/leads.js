// 🔹 **Final Lead Model (Refined):**
// - `name` (String, required) → Lead ka naam.
// - `email` (String, optional) → Lead ka email.
// - `phone` (String, optional) → Lead ka phone.
// - `source` (String, default: "manual") → Default "manual", taaki user ko bharna na pade.
// - `status` (String, default: "new") → Default "new", user jab chahe badal sakta hai.
// - `notes` (String, optional) → Extra comments (eg: "Called once", "Requested callback").
// - `assignedTo` (ObjectId, optional) → Agar team hai toh kisi sales person ko assign karne ke liye.
// - `user` (ObjectId, required) → Kisne banaya lead (user ka ID).
// - `followUpDate` (Date, optional) → Agla call ya meeting kab karna hai.
// - `createdAt` (Date, auto) → Kab create hua.
// - `updatedAt` (Date, auto) → Kab update hua.



const mongoose =  require('mongoose');

const leadsSchema =  new mongoose.Schema({
    leadName:{
        type:String,
        required:true,
        min:4,
        max:40,
        trim:true
    },
    LeadEmailId:{
        type:String,
        required:true,
        trim:true
    },
    phone:{
        type:String,
        trim:true
    },
    source:{
        type:String,
        default:'Linkedin.com',
        trim:true
    },
    status:{
        type:String,
        enum:{
            values:[
                'New',        // Newly added lead, hasn't been contacted yet
                'Contacted',  // Lead has been contacted via email or phone
                'Interested', // Lead has shown interest in the job opportunity
                'Follow-up',  // Lead needs a follow-up (awaiting response)
                'No Response', // Lead hasn't responded after initial contact
                'Rejected',   // Lead has declined or is not interested
                'Hired',      // Lead has been hired
                'In Progress', // Lead is in an interview or recruitment stage
                'Not Interested' // Lead explicitly stated no interest
            ]
        },
        default:'New',
        message: '{VALUE} is not a valid status',
        trim:true
    },
    notes:{
        type:String,
        trim:true
    },
    assignedTo:{
        type:String,
        trim:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    followUpDate: {
        type: Date,
        validate: {
            validator: function (value) {
                return value instanceof Date && !isNaN(value);
            },
            message: 'Follow-up date must be a valid date.'
        }
    }
},{timestamps:true})


module.exports = mongoose.model('Lead',leadsSchema)