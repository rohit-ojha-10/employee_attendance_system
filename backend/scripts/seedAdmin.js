const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config({ path: '../.env' });

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/unified_employee_system', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('MongoDB Connected');

        const adminExists = await User.findOne({ email: 'admin@g.com' });

        if (adminExists) {
            console.log('Admin user already exists');
            process.exit();
        }

        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@g.com',
            password: 'admin', // Will be hashed by pre-save hook
            role: 'admin',
        });

        console.log('Admin user created:', admin);
        process.exit();
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
