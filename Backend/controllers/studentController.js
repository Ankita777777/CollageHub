const Student = require('../models/Student')
const User = require('../models/User')
const Attendance = require('../models/Attendence')
const Result = require('../models/Result')
const Leave= require('../models/Leave')
const Payment = require('../models/Payment')

// GET /api/students/profile
const getProfile = async(req,res)=>{
    const student = await Student.findOne({user:req.user._id})
    .populate('user','name email photo')

    if(!student) return res.status(404).json({message: 'Student not found'})
        res.json(student)
}

// PUT /api/students/profile
 
const updateProfile = async(req,res) =>{
    const student = await Student.findOne({user:req.user>_id})
    if(!student) return res.status(404).json({message: 'Student not found'})

        const {phone, address}= req.body
        student.phone = phone || student.phone
        student.address = address || student.address
         await student.save()
         res.json({message : 'Profile updated', student})
    }


    //@GET /api/students/attendence

    const getAttendence = async(req, res)=>{
        const student = await Student.findOne({user:req.user._id})
        const records= await Attendence.find({student: student._id})
          .populate('course','name code')
          .sort({date:-1})

          //calculate percentage per subject
          const summary = {}
          records.forEach((r)=>{
            const key= r.course._id.toString()
            if(!summary[key]){
                summary[key]= {course: r.course, total:0, present: 0}
            }
            summary[key].total++
            if(r.status === 'present') summary[key].present++
          })

           const result = Object.values(summary).map((s) => ({
    course: s.course,
    total: s.total,
    present: s.present,
    percentage: ((s.present / s.total) * 100).toFixed(1),
  }))

  res.json({ records, summary: result })

    }

    //Get  /api/students/results
    const getResults = async(req,res)=>{
      const student = await Student.findOne({user: req.user._id})
      const results= await Result.find({student:student._id})
      .populate('course', 'name code creditHours')
      .sort({semester: 1})
      res.json(results)
    }

    //Get /api/students/fee
    const getFreeStatus = async(req,res)=>{
      const student = await Student.findOne({user:req.user._id})
      const payments = await Payment.find({student:student._id}).sort({ createdAt: -1})
       res.json({feeStatus : student.feeStatus, payments})
    }

    //Post /api/students/leave
    const applyLeave = async(req,res)=>{
      const student = await Student.findOne({user: req.user._id})
      const {fromDate, toDate, reason} = req.body
      const leave = await Leave.create({student: student._id , fromDate, toDate , reason})
      res.status(201).json({message: 'Leave applied', leave})
    }


//get /api/students/leave
const getLeaves = async( req,res)=>{
  const student = await Student.findOne({user: req.user._id})
  const leaves = await Leave.find({student:student._id}).sort({createdAt: -1})
  res.json(leaves)
}

module.exports= { getProfile, updateProfile, getAttendance, getResults,getFreeStatus, applyLeave, getLeaves }

