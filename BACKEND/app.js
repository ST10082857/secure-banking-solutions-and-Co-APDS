//was created right after express (npm install express) was installed
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

//using middleware 
// Logging middleware
const loggingMiddleware = (req, res, next) => {
    console.log(`${req.method} request for '${req.url}'`);
    next(); // Call the next middleware function
};

