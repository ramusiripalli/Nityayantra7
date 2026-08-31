import mongoose from 'mongoose';
import { execSync } from 'child_process';

/**
 * Transparent Windows SRV fallback resolver
 * Fixes Node.js c-ares DNS bug (querySrv ECONNREFUSED) for MongoDB Atlas on Windows
 */
function resolveSrvFallback(uri) {
  if (!uri || !uri.startsWith('mongodb+srv://')) return uri;

  try {
    const withoutPrefix = uri.replace('mongodb+srv://', '');
    const atIndex = withoutPrefix.indexOf('@');
    if (atIndex === -1) return uri;

    const auth = withoutPrefix.substring(0, atIndex);
    const rest = withoutPrefix.substring(atIndex + 1);

    const slashIndex = rest.indexOf('/');
    const questionIndex = rest.indexOf('?');

    let host = rest;
    let db = '';

    if (slashIndex !== -1) {
      host = rest.substring(0, slashIndex);
      const afterSlash = rest.substring(slashIndex + 1);
      if (afterSlash.includes('?')) {
        db = afterSlash.split('?')[0];
      } else {
        db = afterSlash;
      }
    } else if (questionIndex !== -1) {
      host = rest.substring(0, questionIndex);
    }

    // Query system DNS via nslookup silently for SRV records
    const srvOutput = execSync(`nslookup -type=SRV _mongodb._tcp.${host}`, {
      timeout: 4000,
      stdio: ['pipe', 'pipe', 'ignore'],
    }).toString();

    const matches = [...srvOutput.matchAll(/svr hostname\s*=\s*([^\s\r\n]+)/g)];
    const resolvedHosts = matches.map((m) => `${m[1]}:27017`).join(',');

    if (!resolvedHosts) return uri;

    let replicaSet = 'atlas-lkgvin-shard-0';
    try {
      const txtOutput = execSync(`nslookup -type=TXT ${host}`, {
        timeout: 4000,
        stdio: ['pipe', 'pipe', 'ignore'],
      }).toString();
      const repMatch = txtOutput.match(/replicaSet=([a-zA-Z0-9_-]+)/);
      if (repMatch) {
        replicaSet = repMatch[1];
      }
    } catch {
      // ignore
    }

    const standardUri = `mongodb://${auth}@${resolvedHosts}/${db || 'nitya-yantra'}?ssl=true&replicaSet=${replicaSet}&authSource=admin&retryWrites=true&w=majority`;
    return standardUri;
  } catch (e) {
    return uri;
  }
}

/**
 * Reusable MongoDB Connection Module (Singleton Connection Pool)
 * Connects once upon backend startup and reuses the connection.
 */
export const connectDB = async () => {
  // If already connected, reuse connection
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  let uri = process.env.MONGODB_URI;

  if (!uri || !uri.trim() || uri === '<MY_MONGODB_CONNECTION_STRING>') {
    console.warn(
      '⚠️  MONGODB_URI is not set or contains the placeholder. Please enter your MongoDB connection string in server/.env or backend/.env'
    );
    return null;
  }

  // Pre-resolve SRV for Windows Node.js c-ares DNS compatibility
  if (uri.startsWith('mongodb+srv://')) {
    const resolved = resolveSrvFallback(uri);
    if (resolved && resolved !== uri) {
      console.log('🔄 Resolved MongoDB Atlas SRV to replica set URI for Windows compatibility.');
      uri = resolved;
    }
  }

  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log(`✅ MongoDB Atlas Connected Successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    return null;
  }
};

// Global Mongoose Connection Event Listeners
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected.');
});

mongoose.connection.on('reconnected', () => {
  console.log('🔄 MongoDB reconnected.');
});

mongoose.connection.on('error', (err) => {
  console.error(`❌ MongoDB Runtime Error: ${err.message}`);
});

export default connectDB;
