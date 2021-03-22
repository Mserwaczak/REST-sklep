const express = require('express');
const api = require('./src/api')
const errorHandler = require("./src/middleware/errorHandler");
const databaseErrorHandler = require("./src/middleware/dataBaseErrorHandler");
const notFoundErrorHandler = require("./src/middleware/notFoundErrorHandler");

const port = process.env.PORT || 2400;
const env = process.env.NODE_ENV || 'development';
const app = express();
app.use(express.json());
app.use('/api', api);
app.use(databaseErrorHandler);
app.use(errorHandler);
app.use(notFoundErrorHandler)


app.listen(port, '127.0.0.1', () => {
    console.log(`Server listening on http://127.0.0.1:${port} in ${env} mode`);
})