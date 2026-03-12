const User = require('../Models/User'); // Aapka schema path
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// exports.signup = async (req, res) => {
//     try {
//         const { name, email, password, role, enrollmentNumber, secretKey } = req.body;

//         let user = await User.findOne({ email });
//         if (user) return res.status(400).json({ msg: "User already exists" });

//         let universityId ; 
//         if (role === 'admin') {
//             if (secretKey !== process.env.ADMIN_SECRET) {
//                 return res.status(403).json({ msg: "Invalid Secret Key for Admin" });
//             }
//             universityId = `ADM-${Math.floor(1000 + Math.random() * 9000)}`;
//         }

//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         user = new User({
//             name,
//             email,
//             password:hashedPassword,
//             role,
//             universityId
//         });

//         await user.save();

//         // --- TOKEN GENERATION ADDED ---
//         const token = jwt.sign(
//             { id: user._id, role: user.role },
//             process.env.JWT_SECRET || 'secret',
//             { expiresIn: '7d' }
//         );

//         // Response mein token aur user object bhejein
//         res.status(201).json({ 
//             msg: "User registered successfully", 
//             // universityId,
//             token,
//             user: {
//                 id: user._id,
//                 name: user.name,
//                 role: user.role,
//                 email: user.email,
//                 universityId: user.universityId
//             }
//         });

//     } catch (err) {
//         res.status(500).send("Server Error: " + err.message);
//     }
// };



exports.signup = async (req, res) => {
    try {
        const { name, email, password, role, enrollmentNumber, secretKey } = req.body;

        // 1. Check if user already exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "User already exists" });

        let universityId;

        // 2. Role-based Logic
        if (role === 'admin') {
            // Admin validation
            if (secretKey !== process.env.ADMIN_SECRET) {
                return res.status(403).json({ msg: "Invalid Secret Key for Admin" });
            }
            // Auto-generate Admin ID
            universityId = `ADM-${Math.floor(1000 + Math.random() * 9000)}`;
        } else {
            // Student validation: Enrollment Number must be present
            if (!enrollmentNumber || enrollmentNumber.trim() === "") {
                return res.status(400).json({ msg: "Enrollment Number is required for Students" });
            }
            universityId = enrollmentNumber;
        }

        // 3. Double check for unique universityId in DB
        const existingId = await User.findOne({ universityId });
        if (existingId) {
            return res.status(400).json({ msg: "This Enrollment Number is already registered" });
        }

        // 4. Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 5. Save User
        user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            universityId,
            isLoggedIn: true, // Naya user signup hote hi active dikhega
            lastActiveAt: new Date()
        });

        await user.save();

        // Real-time update for dashboard
        if (global.io) {
            global.io.emit('statusChanged', { userId: user._id, isLoggedIn: true });
        }
        // 6. Token Generation
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '7d' }
        );

        res.status(201).json({ 
            msg: "User registered successfully", 
            token,
            user: {
                id: user._id,
                name: user.name,
                role: user.role,
                email: user.email,
                universityId: user.universityId,
                isLoggedIn: true // Response mein bhi bhej rahe hain
            }
        });

    } catch (err) {
        console.error("Signup Error:", err.message);
        res.status(500).send("Server Error: " + err.message);
    }
};

// Express route
exports.getStudents = async (req, res) => {
    try {
        // Sirf unhe fetch karein jinka role 'student' hai
        const students = await User.find({ role: 'student' }).select('-password');
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};
        
exports.login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Step 1: Role ko lowercase karein taaki DB se match ho (ADMIN -> admin)
        const normalizedRole = role.toLowerCase(); 

        // Step 2: User ko email aur lowercase role se dhoondhein
        const user = await User.findOne({ email, role: normalizedRole });
        
        if (!user) {
            return res.status(400).json({ msg: "Invalid Credentials or Role" });
        }


//         if (user.isLoggedIn === true) {
//     return res.status(400).json({ msg: "User already logged in on another device/tab." });
// }

if (user.isLoggedIn) {
            const now = new Date();
            const lastActive = new Date(user.lastActiveAt);
            const diffInMinutes = (now - lastActive) / 60000;

if (diffInMinutes < 15) {
                return res.status(400).json({ msg: "User already logged in on another device/tab." });
            }
        }
        // Step 3: Password compare karein (Bcrypt use karke)
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid Credentials" });
        }

        // Step 4: Login status update karein
        // Step 4: Login status check aur update


user.isLoggedIn = true;
user.lastActiveAt = new Date();
        await user.save();
        global.io.emit('statusChanged', { userId: user._id, isLoggedIn: true });

        // Step 5: JWT Token generate karein
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET || 'secret', 
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                role: user.role,
                universityId: user.universityId
            }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};


exports.heartbeat = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) return res.status(400).send("User ID required");

        // Sirf lastActiveAt update karein, baaki kuch nahi
        await User.findByIdAndUpdate(userId, { 
            lastActiveAt: new Date() 
        });

        res.status(200).json({ status: "alive" });
    } catch (err) {
        res.status(500).send("Heartbeat error");
    }
};
// ==========================================
// 3. GET Profile (Settings page data fetch karne ke liye)
// ==========================================
exports.getUserProfile = async (req, res) => {
    try {
        // req.user.id auth middleware se aayega
        const user = await User.findById(req.user.id).select('-password');

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User nahi mila' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ==========================================
// 4. PUT Profile Update (Settings edit karke save karne ke liye)
// ==========================================
exports.updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            // New data update logic
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            
            user.universityId = req.body.universityId || user.universityId;
            // Agar naya password dala hai toh hi hash karke save karein
            if (req.body.password && req.body.password.trim() !== "") {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(req.body.password, salt);
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                universityId: updatedUser.universityId,
                message: "Profile successfully update ho gayi!"
            });
        } else {
            res.status(404).json({ message: 'User nahi mila' });
        }
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Email pehle se register hai" });
        }
        res.status(500).json({ message: 'Update fail ho gaya', error: error.message });
    }
};

// ==========================================
// Other Student Management APIs
// ==========================================
exports.getAllStudents = async (req, res) => {
    try {
        const students = await User.find({ role: 'student' }).select('-password');
        res.status(200).json({ success: true, data: students });
    } catch (error) {
        res.status(500).json({ success: false, message: "Data fetch fail", error: error.message });
    }
};


exports.updateStudentByAdmin = async (req, res) => {
    try {
        const { name, email, universityId, password } = req.body;

        // 1. Password Length Validation (Min 6 digits)
        if (password && password.trim() !== "" && password.length < 6) {
            return res.status(400).json({ message: "Password kam se kam 6 characters ka hona chahiye!" });
        }

        // 2. Duplicate University ID Check
        if (universityId) {
            const existingStudent = await User.findOne({ universityId });
            // Agar ID mil gayi aur wo us student ki nahi hai jise hum update kar rahe hain
            if (existingStudent && existingStudent._id.toString() !== req.params.id) {
                return res.status(400).json({ message: "Ye University ID pehle se kisi aur student ko assigned hai!" });
            }
        }

        const user = await User.findById(req.params.id);

        if (user) {
            user.name = name || user.name;
            user.email = email || user.email;
            user.universityId = universityId || user.universityId;

            if (password && password.trim() !== "") {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(password, salt);
            }

            await user.save();
            res.json({ message: "Student updated successfully!" });
        } else {
            res.status(404).json({ message: 'Student nahi mila' });
        }
    } catch (error) {
        // Agar database level par koi unique constraint fail hota hai toh uska error handling
        if (error.code === 11000) {
            return res.status(400).json({ message: "Duplicate data: Ye ID ya Email pehle se exist karta hai!" });
        }
        res.status(500).json({ message: 'Update fail', error: error.message });
    }
};



exports.deleteStudentByAdmin = async (req, res) => {
  try {
    const studentId = req.params.id;

    // 1. Check karein ki student exist karta hai
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // 2. AGAR DUSRE COLLECTIONS HAIN (Optional Logic)
    // await Marks.deleteMany({ studentId: studentId });
    // await Attendance.deleteMany({ studentId: studentId });

    // 3. Database se permanently remove karein
    await User.findByIdAndDelete(studentId);

    res.json({ success: true, message: 'Student permanently removed from the system' });
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

// exports.deleteStudentByAdmin = async (req, res) => {
//   try {
//     const student = await User.findById(req.params.id);
//     if (student) {
//       await student.deleteOne();
//       res.json({ message: 'Student removed successfully' });
//     } else {
//       res.status(404).json({ message: 'Student not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
exports.logout = async (req, res) => {
    try {
        const userId = req.user.id; // Yeh middleware se aayega (JWT verify hone ke baad)
        await User.findByIdAndUpdate(userId, { 
            isLoggedIn: false,
            lastActiveAt: new Date()
             
        });
        // Socket.io se dashboard ko signal bhejein
        if (global.io) {
            global.io.emit('statusChanged', { userId: userId, isLoggedIn: false });
        }
        // global.io.emit('statusChanged', { userId: userId, isLoggedIn: false });
        res.json({ msg: "Logged out successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.logoutOnClose = async (req, res) => {
    try {
        const { email } = req.body;
        if (email) {
            // Database mein user ka status update karein
            await User.findOneAndUpdate(
                { email: email }, 
                { isLoggedIn: false, lastActiveAt: new Date() }
            );
        }
        res.status(200).send("Status updated");
    } catch (err) {
        console.error("Tab close logout error:", err);
        res.status(500).send("Error");
    }
};
exports.forceLogout = async (req, res) => {
    try {
        const { userId } = req.body;
        if (userId) {
            await User.findByIdAndUpdate(userId, { isLoggedIn: false });
        }
        res.json({ msg: "Status Reset" });
    } catch (err) {
        res.status(500).send("Server Error");
    }
};