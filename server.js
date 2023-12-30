const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Import the cors middleware

const app = express();
const port = 3001;

const apiKey = '35a9f735-e580-439c-9059-cbcfc22e4389';
const coinmarketcapApiUrl = 'https://pro-api.coinmarketcap.com/v1';

// Use cors middleware with all origins allowed
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Endpoint to fetch the top 100 cryptocurrencies and supported currencies
app.get('/api/top100', async (req, res) => {
  try {
    const response = await axios.get(`${coinmarketcapApiUrl}/cryptocurrency/listings/latest`, {
      params: {
        start: 1,
        limit: 100,
        convert: 'USD', // You can change the convert parameter to other currencies
      },
      headers: {
        'X-CMC_PRO_API_KEY': apiKey,
      },
    });

    res.json(response.data.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint for currency conversion
app.post('/api/convert', async (req, res) => {
  const { sourceCurrency, amount, targetCurrency } = req.body;

  try {
    const response = await axios.get(`${coinmarketcapApiUrl}/tools/price-conversion`, {
      params: {
        amount,
        symbol: sourceCurrency,
        convert: targetCurrency,
      },
      headers: {
        'X-CMC_PRO_API_KEY': apiKey,
      },
    });

    res.json(response.data.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
