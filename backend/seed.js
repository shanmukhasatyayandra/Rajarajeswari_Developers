const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB ✅');

    // ✅ Check for your new admin email
    const adminExists = await User.findOne({ 
      email: 'lokeswararaoyandra@gmail.com' 
    });

    if (!adminExists) {
      const admin = new User({
        email: 'lokeswararaoyandra@gmail.com',
        password: 'lokeswararao1976'
      });

      await admin.save();

      console.log('Default admin created: lokeswararaoyandra@gmail.com / lokeswararao1976');
    } else {
      console.log('Admin user already exists.');
    }

    process.exit();
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB ❌', err);
    process.exit(1);
  });