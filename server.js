const express = require('express');
require('dotenv').config();
const connectDb = require('./config/dbConnection');
const errorHandler = require('./middleware/errorHandler');
const userRouter = require('./routes/userDetailsRoutes');
const marketPlaceRouter = require('./routes/marketPlaceRoutes');
const productsRouter = require('./routes/productsRoutes');
const orderRouter = require('./routes/orderRoutes');

const port = process.env.PORT || 6000;

connectDb();
const app = express();
app.use(express.json());

app.use('/api/users', userRouter);
app.use('/api/marketplace', marketPlaceRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', orderRouter);
app.use(errorHandler);

const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})

process.on("unhandledRejection", err => {
    console.log(`An error occured ${err.message}`)
    server.close(() => process.exit(1));
})