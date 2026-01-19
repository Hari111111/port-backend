import mongoose from 'mongoose';

const projectSchema = mongoose.Schema({
    title: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    technologies: [String],
    liveUrl: { type: String },
    githubUrl: { type: String },
    featured: { type: Boolean, default: false },
}, {
    timestamps: true,
});

const Project = mongoose.model('Project', projectSchema);
export default Project;
