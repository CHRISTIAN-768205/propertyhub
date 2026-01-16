const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/propertyhub')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ Connection Error:', err);
    process.exit(1);
  });

async function createSuperAdmin() {
  try {
    // Check if super admin already exists
    const existing = await User.findOne({ role: 'superadmin' });
    
    if (existing) {
      console.log('⚠️  Super Admin already exists!');
      console.log('📧 Email:', existing.email);
      console.log('👤 Name:', existing.fullName);
      console.log('\n💡 Use this account to login, or delete it first to create a new one.');
      process.exit(0);
    }

    // Create super admin
    const superAdmin = new User({
      fullName: 'Super Administrator',
      email: 'admin@propertyhub.co.ke',
      password: 'Admin@123', // Change this!
      role: 'superadmin',
      phone: '+254712345678'
    });

    await superAdmin.save();

    console.log('\n✅ Super Admin Created Successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:    admin@propertyhub.co.ke');
    console.log('🔑 Password: Admin@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🔗 Login at: http://localhost:3000/login');
    console.log('\n⚠️  IMPORTANT: Change the password after first login!\n');
    
    // Test password
    const test = await superAdmin.comparePassword('Admin@123');
    console.log('✅ Password verification:', test ? 'PASS' : 'FAIL');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createSuperAdmin();