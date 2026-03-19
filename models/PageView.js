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
    },
    browsers: {
        type: Map,
        of: Number,
        default: {}
    },
    operatingSystems: {
        type: Map,
        of: Number,
        default: {}
    },
    devices: {
        type: Map,
        of: Number,
        default: {}
    },
    lastActive: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const PageView = mongoose.model('PageView', pageViewSchema);

export default PageView;
