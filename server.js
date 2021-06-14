import express from 'express';
import getData from './api_data/data.js'
import btcData from './routes/btcData.js'

const app = express();

// Download data from API
getData();

// Define Routes
app.use('/btcData', btcData);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));