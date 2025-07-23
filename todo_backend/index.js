const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const route = require('./routes/todoRoutes');
dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(cors());
const PORT = process.env.PORT || 3000;
const MONGOURL = process.env.MONGOURL ;

mongoose.connect(MONGOURL).then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});   

app.use('/todos', route);
