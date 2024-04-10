import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './router/route.js';
import connectDB from './database/connect.js';
import user from './router/user.js';

dotenv.config();

/**app declaration */
const app = express();

/**app  middleware */
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

/**routes */
app.use('/api', router);
app.use('/api/user', user);

app.get('/', (req, res) => {
    try {
        res.json('Get req');
    } catch (error) {
        res.json(error);
    }
});

const port = process.env.PORT || 8080;

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
