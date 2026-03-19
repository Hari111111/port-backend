import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from './models/Question.js';

dotenv.config();

const questions = [
  {
    question: "What is React.js?",
    answer: "React is a JavaScript library for building user interfaces, especially for single-page applications.",
    category: ["Frontend"],
    language: ["React.js"],
    type: "Theory",
    difficulty: "Easy",
    priority: 1
  },
  {
    question: "What is Virtual DOM?",
    answer: "The Virtual DOM is a lightweight copy of the actual DOM in memory, used by React to optimize rendering performance.",
    category: ["Frontend"],
    language: ["React.js"],
    type: "Short",
    difficulty: "Medium",
    priority: 2
  },
  {
    question: "Which of the following is used to manage state in a React component?",
    answer: "useState",
    category: ["Frontend"],
    language: ["React.js"],
    type: "MCQ",
    options: ["useState", "useEffect", "useMemo", "useRef"],
    difficulty: "Easy",
    priority: 3
  },
  {
    question: "What is Node.js?",
    answer: "Node.js is a cross-platform, open-source JavaScript runtime environment that executes JavaScript code outside a web browser.",
    category: ["Backend"],
    language: ["Node.js"],
    type: "Short",
    difficulty: "Easy",
    priority: 1
  }
];

const seedQuestions = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        
        // await Question.deleteMany();
        // console.log('Deleted existing questions');
        
        await Question.insertMany(questions);
        console.log('Successfully seeded questions!');
        
        process.exit(0);
    } catch (err) {
        console.error('Error seeding questions:', err);
        process.exit(1);
    }
};

seedQuestions();
