import express from 'express';
import path from 'path';

const app = express();

const port = process.env.PORT || 3001;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath), () => {
    console.log(`Server is up on port ${port}`);
});