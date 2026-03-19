import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from './models/Question.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load .env
dotenv.config({ path: path.join(__dirname, '.env') });

const migrateQuestions = async () => {
    try {
        console.log('Connecting to MONGO_URI:', process.env.MONGO_URI ? 'FOUND' : 'NOT FOUND');
        
        if (!process.env.MONGO_URI) {
            throw new Error('Please set MONGO_URI in .env file');
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const questions = await Question.find();
        console.log(`Checking ${questions.length} questions...`);
        let updateCount = 0;

        for (const q of questions) {
            let changed = false;
            
            // Normalize category: ensure it's an array
            if (typeof q.category === 'string') {
                q.category = [q.category];
                changed = true;
            } else if (!q.category || (Array.isArray(q.category) && q.category.length === 0)) {
                q.category = ['General'];
                changed = true;
            }

            // Normalize language: ensure it's an array
            if (typeof q.language === 'string') {
                q.language = [q.language];
                changed = true;
            } else if (!q.language || (Array.isArray(q.language) && q.language.length === 0)) {
                q.language = ['JavaScript'];
                changed = true;
            }

            if (changed) {
                // We use markModified because we are changing the type and structure
                q.markModified('category');
                q.markModified('language');
                await q.save();
                updateCount++;
            }
        }

        console.log(`Migration complete! Successfully updated ${updateCount} questions to the new format.`);
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
};

migrateQuestions();
