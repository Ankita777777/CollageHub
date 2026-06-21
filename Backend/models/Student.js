const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
 user:{ type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
 rollNo:{type: String, unique :true},
 semester:{type:Number},
 program:{type: String}, //BSc.CSIT
 batch:{type:String},//2081
 phone:{type:String},
 address:{type:String},
 fatherName:{type:String},
 feeStatus:{type:String, enum:['paid','due','partial'], default:'due'},
}, {timestamps:true})

module.exports = mongoose.model('Student', studentSchema)