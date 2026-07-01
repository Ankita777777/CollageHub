const mongoose = require('mongoose')

const admissionSchema = new mongoose.Schema({
    name: { type: String, required: true},
    email: {type: String, required:true},
    phone: { type: String, required: true},
    address:{type: String, required: true},
    program: {type: String, required:true},
    lastSchool :{ type:String, required: true},
    percentage:{type:String, required:true},
    message:{type:string},

    status:{
        type:String,
        enum:['pending','reviewing', 'accepted', 'rejectd'],
        default:'pending'
    },
    reviewNote: {type: String},
    reviewedBy : {type: mongoose.Schema.Types.ObjectId, ref:'User'},
    
}, {timestamps: true})

module.exports = mongoose.model('Admission', admissionSchema)