import mongoose from 'mongoose';

const profileSchema = mongoose.Schema({
    name: { type: String, required: true },
    title: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    location: { type: String },
    about: { type: String }, // Bio/Summary
    resumeLink: { type: String }, // URL to PDF

    // Social Links
    socials: {
        github: { type: String, default: '' },
        linkedin: { type: String, default: '' },
        website: { type: String, default: '' },
    },

    // Arrays for lists
    skills: [String],

    // We can add intricate Experience/Education later if needed, 
    // but let's start with a simpler structure or just text for now to match "resume details" roughly 
    // without building a complex nested UI editor immediately unless requested.
    // Actually, let's add them as flexible arrays of objects for future proofing.
    experience: [{
        position: String,
        company: String,
        duration: String,
        description: String
    }],
    education: [{
        degree: String,
        school: String,
        year: String
    }],
    interests: [String],
}, {
    timestamps: true,
});

const Profile = mongoose.model('Profile', profileSchema);
export default Profile;
