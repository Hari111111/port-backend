import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Question from './models/Question.js';

dotenv.config();

const questions = [
  {
    question: "What is Next.js?",
    answer: "Next.js is a React framework that enables several extra features, including server-side rendering and generating static websites.",
    category: "Frontend",
    language: "Next.js",
    type: "Short",
    difficulty: "Medium",
    priority: 1
  },
  {
    question: "Explain the difference between SQL and NoSQL databases.",
    answer: "SQL databases are relational and have a predefined schema, while NoSQL databases are non-relational and have a dynamic schema for unstructured data.",
    category: "Database",
    language: "SQL",
    type: "Short",
    difficulty: "Medium",
    priority: 2
  },
  {
    question: "Which hook is used for side effects in React?",
    answer: "useEffect",
    category: "Frontend",
    language: "React.js",
    type: "MCQ",
    options: ["useContext", "useEffect", "useReducer", "useCallback"],
    difficulty: "Easy",
    priority: 3
  },
  {
     question: "What is a Middleware in Express.js?",
     answer: "Middleware functions are functions that have access to the request object (req), the response object (res), and the next middleware function in the application’s request-response cycle.",
     category: "Backend",
     language: "Node.js",
     type: "Short",
     difficulty: "Medium",
     priority: 1
  }
];

const seed = async () => {
    try {
        await connectDB();
        console.log('Clearing old questions...');
        await Question.deleteMany();
        
        console.log('Inserting new questions...');
        await Question.insertMany(questions);
        console.log('Seed successful!');
        process.exit(0);
    } catch (err) {
        console.error('Seed Error:', err);
        process.exit(1);
    }
}
seed();
