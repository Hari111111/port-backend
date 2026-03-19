import mongoose from 'mongoose';
import dotenv from 'dotenv';
import PageView from './models/PageView.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const checkViews = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        const views = await PageView.find();
        console.log(`Found ${views.length} page view records`);
        views.forEach(v => console.log(`${v.pagePath}: ${v.count}`));
        process.exit(0);
    } catch (err) {
        console.error('Failed to check views:', err);
        process.exit(1);
    }
};

checkViews();
