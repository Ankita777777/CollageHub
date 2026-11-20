const mongoose = require('mongoose')
const bcrypt   = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name:                { type: String, required: true, trim: true },
  email:               { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:            { type: String, required: true },
  role:                { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
  photo:               { type: String, default: '' },
  isActive:            { type: Boolean, default: true },
  resetPasswordToken:  { type: String },
  resetPasswordExpire: { type: Date },
}, { timestamps: true })

// No `next` parameter: an async hook just returns when it's done
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  const salt    = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.matchPassword = async function (entered) {
  return await bcrypt.compare(entered, this.password)
}

module.exports = mongoose.model('User', userSchema)