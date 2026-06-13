import 'dotenv/config';
import app       from './app.js';
import connectDB from './src/config/db.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment : ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Base URL    : ${process.env.BASE_URL}`);
      console.log(`💻 Client URL  : ${process.env.CLIENT_URL}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

// Handle unhandled promise rejections globally
process.on('unhandledRejection', (err) => {
  console.error('⚠️  Unhandled rejection:', err.message);
  process.exit(1);
});

startServer();