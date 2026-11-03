const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore in case environments restrict changing DNS servers
}
const mongoose = require('mongoose');

// Verified MongoDB Atlas Cloud Cluster Connection String
const ATLAS_FALLBACK_URI = 'mongodb://srichelluboina2006_db_user:Anjali@ac-hoengxi-shard-00-00.ry0itrr.mongodb.net:27017,ac-hoengxi-shard-00-01.ry0itrr.mongodb.net:27017,ac-hoengxi-shard-00-02.ry0itrr.mongodb.net:27017/learnpulseDB?ssl=true&replicaSet=atlas-g7p7n3-shard-0&authSource=admin&retryWrites=true&w=majority';

let cachedPromise = null;

const connectDB = async () => {
  // Return existing active connection
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // Return connection promise if in-flight
  if (cachedPromise) {
    return cachedPromise;
  }

  const connUri = process.env.MONGO_URI || ATLAS_FALLBACK_URI;
  const isAtlas = connUri.includes('mongodb.net') || connUri.startsWith('mongodb+srv://');

  console.log(`[Database] Connecting to ${isAtlas ? 'MongoDB Atlas Cloud' : 'Local MongoDB'}...`);

  cachedPromise = mongoose.connect(connUri, {
    serverSelectionTimeoutMS: 10000,
    autoIndex: true
  }).then((conn) => {
    console.log(`[Database] MongoDB Connected Successfully: ${conn.connection.host}`);
    return conn;
  }).catch((err) => {
    cachedPromise = null;
    console.error(`[Database Error] Connection failed: ${err.message}`);
    if (err.message.includes('bad auth') || err.message.includes('Authentication failed')) {
      console.error('>> TIP: Please check your MongoDB Atlas username and password in .env');
    } else if (err.message.includes('querySrv ENOTFOUND') || err.message.includes('buffering timed out')) {
      console.error('>> TIP: Make sure your IP address is whitelisted in MongoDB Atlas (Network Access -> Allow Access from Anywhere 0.0.0.0/0)');
    }
    throw err;
  });

  return cachedPromise;
};

module.exports = connectDB;
