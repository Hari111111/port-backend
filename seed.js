import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await User.deleteMany();

        await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'password123',
            isAdmin: true,
        });

        await User.create({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
            isAdmin: false,
        });

        await User.create({
            name: 'Jane Smith',
            email: 'jane@example.com',
            password: 'password123',
            isAdmin: false,
        });

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
