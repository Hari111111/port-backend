import mongoose from 'mongoose';

const resumeSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        unique: true
    },
    data: {
        personalInfo: {
            fullName: String,
            email: String,
            phone: String,
            address: String,
            website: String,
            jobTitle: String,
            summary: String,
        },
        education: [{
            school: String,
            degree: String,
            startDate: String,
            endDate: String,
            description: String,
        }],
        experience: [{
            company: String,
            position: String,
            startDate: String,
            endDate: String,
            description: String,
        }],
        skills: [String],
        projects: [{
            name: String,
            link: String,
            description: String,
        }],
        languages: [String],
        customization: {
            primaryColor: String,
            fontFamily: String,
        }
    }
}, {
    timestamps: true,
});

const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;
