const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware for parsing JSON
app.use(express.json());

// API Endpoint for Try-On
app.post('/api/try-on', async (req, res) => {
    const { personImageUrl, garmentImageUrl } = req.body;

    // Validate inputs
    if (!personImageUrl) {
        return res.status(400).json({ error: 'Person image URL is required.' });
    }

    try {
        const requestBody = {
            person_image_url: personImageUrl,
            garment_image_url: garmentImageUrl || null, // Optional garment image URL
        };

        // Call the external API
        const response = await axios.post('https://api.developer.pixelcut.ai/v1/try-on', requestBody, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-API-KEY': 'sk_de49ef41963e438892cc3a39f7531ee5', // Replace with your actual API key
            },
        });

        // Respond with the result URL
        res.json({ tryOnImageUrl: response.data.result_url });
    } catch (error) {
        console.error('API error:', error.response ? error.response.data : error.message);

        // Handle the error gracefully and send a meaningful response
        res.status(500).json({
            error: 'Failed to process the Try-On request.',
            details: error.response ? error.response.data : error.message,
        });
    }
});

// Serve static files
app.use(express.static(path.join(__dirname, 'Public')));

// Start the server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
