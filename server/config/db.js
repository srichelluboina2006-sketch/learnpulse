const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore in case environments restrict changing DNS servers
}
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/learnpulseDB';
    const isAtlas = connUri.includes('mongodb.net') || connUri.startsWith('mongodb+srv://');

    console.log(`[Database] Connecting to ${isAtlas ? 'MongoDB Atlas Cloud' : 'Local MongoDB'}...`);

    const conn = await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 8000,
      autoIndex: true
    });

    console.log(`[Database] MongoDB Connected Successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] Connection failed: ${error.message}`);
    if (error.message.includes('bad auth') || error.message.includes('Authentication failed')) {
      console.error('>> TIP: Please check your MongoDB Atlas username and password in .env');
    } else if (error.message.includes('querySrv ENOTFOUND') || error.message.includes('buffering timed out')) {
      console.error('>> TIP: Make sure your IP address is whitelisted in MongoDB Atlas (Network Access -> Allow Access from Anywhere 0.0.0.0/0)');
    }
    // In dev or local, don't crash immediately so server can still serve health check
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
