const { required } = require('joi')
const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema({
    company:{
        type:String,
        required: [true, "Please provide a company name"],
        maxlength: 50,
    },
    position:{
        type:String,
        required:[true, "Please provide a position"],
        maxlenght: 100
    },
    status: {
        type:String,
        enum:['inteview', 'pending', 'declined'],
        default: 'pending'
    },
    createdBy : {
        type: mongoose.Types.ObjectId,
        ref: 'User',  
        required: true
    }
}, {Timestamp:true})

module.exports = mongoose.model("jobsModel", jobSchema)