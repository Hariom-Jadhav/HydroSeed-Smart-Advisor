const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Import Config and Middlewares
const connectDB = require('./config/db');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./middlewares/errorMiddleware');
const Analysis = require('./models/Analysis');

// Import Routes
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const messageRouter = require('./routes/messageRoutes');
const analysisRouter = require('./routes/analysisRoutes');
const feedbackRouter = require('./routes/feedbackRoutes');

// Load env vars
dotenv.config();

// Initialize App
const app = express();

// Connect to Database
connectDB();

// Global Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Body parser with high payload limit for base64 terrain photos
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Mount Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/messages', messageRouter);
app.use('/api/v1/analyses', analysisRouter);
app.use('/api/v1/feedbacks', feedbackRouter);

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
        
        // Automated Mongoose image storage cleanup (purges heavy base64 data older than 2 hours)
        const purgeOldImages = async () => {
          try {
            const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
            const defaultPlaceholder = 'https://images.unsplash.com/photo-1592424001807-6953f93ce0db';
            
            // Clear all analyses older than 2 hours that still contain heavy base64 raw image strings
            const result = await Analysis.updateMany(
              { 
                date: { $lt: twoHoursAgo }, 
                imageUrl: { $regex: '^data:image' } 
              },
              { imageUrl: defaultPlaceholder }
            );
            if (result.modifiedCount > 0) {
              console.log(`🧹 Storage Cleanup: Safely purged ${result.modifiedCount} heavy base64 images older than 2 hours to conserve MongoDB storage.`);
            }
          } catch (err) {
            console.error('Storage Cleanup Scheduler Error:', err);
          }
        };

        // Execute immediately on boot (after 5 seconds buffer)
        setTimeout(purgeOldImages, 5000);
        // Execute periodically every 10 minutes
        setInterval(purgeOldImages, 10 * 60 * 1000);
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
