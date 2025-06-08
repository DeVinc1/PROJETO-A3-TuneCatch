const express = require('express');
const cors = require('cors');
require('dotenv').config();

const maestro = express();

maestro.use(cors());
maestro.use(express.json());

maestro.get('/maestro/v0', (req, res) => {
    res.json({
        message: 'Welcome to Maestro API beta',
        version: 'BETA',
        status: 'running'
    });
});

const PORT = process.env.PORT;
maestro.listen(PORT, () => {
    console.log(`Maestro API is running on port ${PORT}`);
});