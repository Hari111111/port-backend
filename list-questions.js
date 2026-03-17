import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from './models/Question.js';

dotenv.config();

const listQuestions = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('--- Database Check ---');
        const questions = await Question.find({});
        console.log(`Total questions found: ${questions.length}`);
        questions.forEach((q, i) => {
            console.log(`${i+1}. [${q.category}] ${q.question.substring(0, 50)}... (${q.type})`);
        });
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

listQuestions();
