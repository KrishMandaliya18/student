const mongoose = require('mongoose');
  const bcrypt = require('bcryptjs'); 

    const userSchema = new mongoose.Schema({
      name: { type: String, required: true },
      email: {
        type: String,
        required: true,
        unique: true,
         lowercase: true,
         match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
       },
       password: {
         type: String,
         required: true,
         minlength: 6
       },
     role: { type: String, enum: ['student', 'admin', 'teacher', 'hod'], default: 'student' },
     universityId: { type: String, required: true, unique: true },
     department: { type: String }, 
     isLoggedIn: { type: Boolean, default: false } ,
     lastActiveAt: { type: Date, default: Date.now }
}, { timestamps: true });
   

     module.exports = mongoose.model('User', userSchema);