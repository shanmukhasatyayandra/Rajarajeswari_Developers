const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const resetAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/raja_realestate');
    console.log('Connected to MongoDB ✅');

    const email = 'lokeswararaoyandra@gmail.com';
    const password = 'lokeswararao1976';

    let user = await User.findOne({ email });

    if (user) {
      user.password = password;
      await user.save();
      console.log(`Password reset successfully for: ${email} 🔄`);
    } else {
      user = new User({ email, password });
      await user.save();
      console.log(`Admin user created successfully: ${email} ✨`);
    }

    process.exit(0);
  } catch (err) {
    console.error('Error resetting admin password ❌', err);
    process.exit(1);
  }
};

resetAdmin();
