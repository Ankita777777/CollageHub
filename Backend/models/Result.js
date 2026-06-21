const mongoose = require('mongoose')

const resultSchema = new mongoose.Schema({
    student:{ type:mongoose.Schema.Types.ObjectId, ref:'Student', required:true},
    course:{ type:mongoose.Schema.Types.ObjectId, ref:'Course', required:true},
    semester:{type:Number, required:true},
    marks:{ type: Number},
    grade:{type:String},
    status: { type:String, enum:['pass', 'fail', 'pending'], default:'pending'}
}, {timestamps:true})

module.exports = mongoose.model('Result', resultSchema)