import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './database/connect.js';
import user from './router/user.js';
import question from './router/question.js';
import course from './router/course.js';
import option from './router/option.js';
import quiz from './router/quiz.js';

dotenv.config();

/**app declaration */
const app = express();

/**app  middleware */
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

/**routes */
app.use('/api/user', user);
app.use('/api/question', question);
app.use('/api/course', course);
app.use('/api/options', option);
app.use('/api/quiz', quiz);

app.get('/', (req, res) => {
    try {
        res.json('Get req');
    } catch (error) {
        res.json(error);
    }
});

const port = process.env.PORT || 8000;

connectDB()
    .then(() => {
        try {
            app.listen(port, () => {
                console.log(`Server is connected at ${port}`);
            });
        } catch (error) {
            console.log("can't connect server");
        }
    })
    .catch((err) => {
        console.error('Error connecting to the database:', err);
    });
