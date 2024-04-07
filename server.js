import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

/**app declaration */
const app = express();

/**app  middleware */
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

/**routes */

app.get('/', (req, res) => {
    try {
        res.json('Get req');
    } catch (error) {
        res.json(error);
    }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`This server is connected to ${port}`);
});
