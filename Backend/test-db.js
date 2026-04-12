const mongoose = require('mongoose');
const uri = 'mongodb+srv://mandaliyakrish18_db_user:xnYGO9uU454bO2UO@cluster0.zv2g2pd.mongodb.net/?appName=Cluster0';

console.log('Attempting to connect to MongoDB...');
mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log('SUCCESS: Connected to MongoDB cluster');
    process.exit(0);
  })
  .catch(err => {
    console.error('FAILURE: Could not connect to MongoDB cluster');
    console.error('Error name:', err.name);
    console.error('Error message:', err.message);
    process.exit(1);
  });
