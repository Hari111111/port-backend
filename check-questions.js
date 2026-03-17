import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from './models/Question.js';

dotenv.config();

const checkData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        
        const count = await Question.countDocuments();
        console.log(`Total Questions: ${count}`);
        
        if (count > 0) {
            const sample = await Question.findOne();
            console.log('Sample Question:', JSON.stringify(sample, null, 2));
        } else {
            console.log('No questions found in database.');
        }
        
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

checkData();
