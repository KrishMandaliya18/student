const User = require('../Models/User'); // Aapka schema path
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.signup = async (req, res) => {
    try {
        const { name, email, password, role, enrollmentNumber, secretKey } = req.body;

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "User already exists" });

        let universityId = enrollmentNumber; 
        if (role === 'admin') {
            if (secretKey !== process.env.ADMIN_SECRET) {
                return res.status(403).json({ msg: "Invalid Secret Key for Admin" });
            }
            universityId = `ADM-${Math.floor(1000 + Math.random() * 9000)}`;
        }

        // const salt = await bcrypt.genSalt(10);
        // const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            name,
            email,
            password,
            role,
            universityId
        });

        await user.save();

        // --- TOKEN GENERATION ADDED ---
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '7d' }
        );

        // Response mein token aur user object bhejein
        res.status(201).json({ 
            msg: "User registered successfully", 
            // universityId,
            token,
            user: {
                id: user._id,
                name: user.name,
                role: user.role,
                email: user.email,
                universityId: user.universityId
            }
        });

    } catch (err) {
        res.status(500).send("Server Error: " + err.message);
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

        // Step 3: Password compare karein (Bcrypt use karke)
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid Credentials" });
        }

        // Step 4: Login status update karein
        user.isLoggedIn = true;
        await user.save();

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
        res.status(500).json({ success: false, message: "Data fetch nahi ho paya", error: error.message });
    }
}; 



exports.updateStudentByAdmin = async (req, res) => {
  try {
    const { name, universityId, email, password } = req.body;
    const student = await User.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student nahi mila' });
    }

    student.name = name || student.name;
    student.universityId = universityId || student.universityId;
    student.email = email || student.email;
    
    // Agar password naya aaya hai, toh use hash karke save karein
    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      student.password = await bcrypt.hash(password, salt);
    }

    const updatedStudent = await student.save();
    res.json({ success: true, data: updatedStudent });

  } catch (error) {
    console.error("Update Error:", error); // Terminal mein error dekhne ke liye
    res.status(500).json({ message: error.message });
  }
};


exports.deleteStudentByAdmin = async (req, res) => {
  try {
    const student = await User.findById(req.params.id);
    if (student) {
      await student.deleteOne();
      res.json({ message: 'Student removed successfully' });
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.logout = async (req, res) => {
    try {
        // Frontend se user ID milni chahiye (Middleware se ya body se)
        const user = await User.findById(req.user.id); 
        if (user) {
            user.isLoggedIn = false;
            await user.save();
        }
        res.json({ msg: "Logged out successfully" });
    } catch (err) {
        res.status(500).send("Server Error");
    }
};
