const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Task = require('../models/Task');
const Attendance = require('../models/Attendance');

const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const resetUser = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        const testUserEmail = 'test@example.com';
        const testUserPassword = 'password123';

        // 1. Find existing user
        const existingUser = await User.findOne({ email: testUserEmail });

        if (existingUser) {
            console.log('Found existing test user. Cleaning up data...');

            // Delete tasks assigned to/by this user
            await Task.deleteMany({ $or: [{ assignedTo: existingUser._id }, { assignedBy: existingUser._id }] });
            console.log('Deleted user tasks.');

            // Delete attendance records
            await Attendance.deleteMany({ user: existingUser._id });
            console.log('Deleted user attendance records.');

            // Delete the user
            await User.deleteOne({ _id: existingUser._id });
            console.log('Deleted user account.');
        } else {
            console.log('No existing test user found.');
        }

        // 2. Create new user
        console.log('Creating new test user...');
        const newUser = await User.create({
            name: 'Test User',
            email: testUserEmail,
            password: testUserPassword,
            role: 'employee'
        });

        // 3. Create default tasks
        console.log('Assigning default tasks...');
        const statuses = ['Pending', 'In Progress', 'Completed'];
        const getRandomStatus = () => statuses[Math.floor(Math.random() * statuses.length)];

        const defaultTasks = [
            { title: 'Task 1', project: 'Project A', assignedTo: newUser._id, assignedBy: newUser._id, description: 'Default task for Project A', status: getRandomStatus() },
            { title: 'Task 2', project: 'Project B', assignedTo: newUser._id, assignedBy: newUser._id, description: 'Default task for Project B', status: getRandomStatus() },
            { title: 'Task 3', project: 'Project D', assignedTo: newUser._id, assignedBy: newUser._id, description: 'Default task for Project D', status: getRandomStatus() },
            { title: 'Task 4', project: 'Project A', assignedTo: newUser._id, assignedBy: newUser._id, description: 'Default task for Project E', status: getRandomStatus() },
            { title: 'Task 5', project: 'Project B', assignedTo: newUser._id, assignedBy: newUser._id, description: 'Default task for Project F', status: getRandomStatus() },
        ];
        await Task.insertMany(defaultTasks);

        // 4. Create 7 days of attendance history
        console.log('Generating 7 days of attendance history...');
        const tasks = await Task.find({ assignedTo: newUser._id });
        const attendanceRecords = [];

        for (let i = 1; i <= 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateString = date.toISOString().split('T')[0];

            // Random check-in between 9:00 AM and 10:00 AM
            const checkIn = new Date(date);
            checkIn.setHours(9 + Math.random(), Math.floor(Math.random() * 60), 0, 0);

            // Random work duration between 7 and 9 hours
            const workDuration = 7 + Math.random() * 2;

            const checkOut = new Date(checkIn);
            checkOut.setMilliseconds(checkOut.getMilliseconds() + workDuration * 60 * 60 * 1000);

            // Distribute hours among tasks
            const taskHours = [];
            let remainingHours = workDuration;

            // Shuffle tasks to randomize distribution
            const shuffledTasks = [...tasks].sort(() => 0.5 - Math.random());

            shuffledTasks.forEach((task, index) => {
                if (index === shuffledTasks.length - 1) {
                    // Assign remaining hours to the last task
                    taskHours.push({
                        taskId: task._id,
                        taskTitle: task.title,
                        project: task.project,
                        hours: Number(remainingHours.toFixed(2))
                    });
                } else {
                    // Random portion of remaining hours
                    const hours = Math.random() * (remainingHours / 2);
                    remainingHours -= hours;
                    taskHours.push({
                        taskId: task._id,
                        taskTitle: task.title,
                        project: task.project,
                        hours: Number(hours.toFixed(2))
                    });
                }
            });

            attendanceRecords.push({
                user: newUser._id,
                date: dateString,
                checkIn: checkIn,
                checkOut: checkOut,
                status: 'Present',
                workHours: Number(workDuration.toFixed(2)),
                taskHours: taskHours
            });
        }

        await Attendance.insertMany(attendanceRecords);
        console.log('Created 7 days of attendance history.');

        console.log('-----------------------------------');
        console.log('✅ Test User Reset Successfully!');
        console.log(`Email: ${testUserEmail}`);
        console.log(`Password: ${testUserPassword}`);
        console.log('-----------------------------------');

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

resetUser();
