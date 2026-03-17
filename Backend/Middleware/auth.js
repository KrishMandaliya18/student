const jwt = require('jsonwebtoken');
const User = require('../Models/User');

// 1. Pehla Middleware: Sirf check karega ki user Login hai ya nahi
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      if (!token || token === "null" || token === "undefined") {
          return res.status(401).json({ message: 'Invalid or missing token' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Yahan hum user ka pura data (including role) req.user mein save kar rahe hain
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed', error: error.message });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
};

// 2. Dusra Middleware: Check karega ki kya login user "Admin" hai?
const isAdmin = (req, res, next) => {
  // protect middleware ne req.user set kar diya hai, ab hum uska role check karenge
  if (req.user && req.user.role === 'admin') {
    next(); // Agar admin hai toh permission de do
  } else {
    res.status(403).json({ message: 'Access Denied: Only Admins are allowed here' });
  }
};

// Dono ko export karein
module.exports = { protect, isAdmin };
