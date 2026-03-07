// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs'); // bcryptjs import karein

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true,
//     match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
//   },
//   password: {
//     type: String,
//     required: true,
//     minlength: 6
//   },
//   role: { type: String, enum: ['student', 'admin'], default: 'student' },
//   universityId: { type: String, required: true, unique: true }
// }, { timestamps: true });

// // --- PASSWORD HASHING LOGIC START ---
// // Save hone se pehle password ko hash karne ka middleware
// userSchema.pre('save', async function (next) {
//   // Agar password change nahi hua hai, toh hashing skip karein
//   if (!this.isModified('password')) {
//     return next();
//   }

//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (error) {
//     next(error);
//   }
// });
// // --- PASSWORD HASHING LOGIC END ---

// module.exports = mongoose.model('User', userSchema);

 const mongoose = require('mongoose');
  const bcrypt = require('bcryptjs'); // Step 1: bcryptjs import karein

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
     role: { type: String, enum: ['student', 'admin'], default: 'student' },
     universityId: { type: String, required: true, unique: true },
     isLoggedIn: { type: Boolean, default: false } ,
     lastActiveAt: { type: Date, default: Date.now } // <--- Yeh line add karein
}, { timestamps: true });
   

     module.exports = mongoose.model('User', userSchema);