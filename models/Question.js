import mongoose from 'mongoose';

const InterviewQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Please add a question'],
    trim: true
  },
  answer: {
    type: String,
    required: [true, 'Please add an answer']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Frontend', 'Backend', 'Database', 'DevOps', 'General', 'Programming', 'Other']
  },
  language: {
    type: String,
    default: 'JavaScript',
    enum: ['JavaScript', 'TypeScript', 'React.js', 'Next.js', 'Node.js', 'NestJS', 'MongoDB', 'PostgreSQL', 'Python', 'Java', 'C++', 'PHP', 'HTML/CSS', 'SQL', 'Other']
  },
  type: {
    type: String,
    required: [true, 'Please add a question type'],
    enum: ['MCQ', 'Short', 'Long'],
    default: 'Long'
  },
  options: [{
    type: String
  }],
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('InterviewQuestion', InterviewQuestionSchema);
