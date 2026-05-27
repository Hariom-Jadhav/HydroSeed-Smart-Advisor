const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Import Config and Middlewares
const connectDB = require('./config/db');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./middlewares/errorMiddleware');

// Import Routes
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const messageRouter = require('./routes/messageRoutes');

// Load env vars
dotenv.config();

// Initialize App
const app = express();

// Connect to Database
connectDB();

// Global Middlewares
app.use(cors());
app.use(express.json()); // Body parser

// Mount Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/messages', messageRouter);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'success', 
    message: 'HydroSeed Smart Advisor API is running' 
  });
});

// Handle unhandled routes
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(globalErrorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
if(require.main === module){
    const server = app.listen(PORT, () => {
        console.log(`Server is running beautifully on port ${PORT} in ${process.env.NODE_ENV} mode.`);
    });

    // Handle asynchronous database unhandled rejections
    process.on('unhandledRejection', err => {
      console.log('UNHANDLED REJECTION! 💥 Shutting down...');
      console.log(err.name, err.message);
      server.close(() => {
        process.exit(1);
      });
    });
}

module.exports = app;
