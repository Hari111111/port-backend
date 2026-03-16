import mongoose from 'mongoose';

const pageViewSchema = new mongoose.Schema({
    pagePath: {
        type: String,
        required: true,
        unique: true
    },
    count: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const PageView = mongoose.model('PageView', pageViewSchema);

export default PageView;
