const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const logger = {
  // Get current timestamp
  getTimestamp: () => {
    return new Date().toISOString();
  },

  // Log levels
  info: (message) => {
    const logMessage = `[${logger.getTimestamp()}] [INFO] ${message}`;
    console.log('\x1b[36m%s\x1b[0m', logMessage); // Cyan color
    logger.writeToFile('info.log', logMessage);
  },

  error: (message) => {
    const logMessage = `[${logger.getTimestamp()}] [ERROR] ${message}`;
    console.error('\x1b[31m%s\x1b[0m', logMessage); // Red color
    logger.writeToFile('error.log', logMessage);
  },

  warn: (message) => {
    const logMessage = `[${logger.getTimestamp()}] [WARN] ${message}`;
    console.warn('\x1b[33m%s\x1b[0m', logMessage); // Yellow color
    logger.writeToFile('warn.log', logMessage);
  },

  debug: (message) => {
    if (process.env.NODE_ENV === 'development') {
      const logMessage = `[${logger.getTimestamp()}] [DEBUG] ${message}`;
      console.log('\x1b[35m%s\x1b[0m', logMessage); // Magenta color
      logger.writeToFile('debug.log', logMessage);
    }
  },

  // Write logs to file
  writeToFile: (filename, message) => {
    const logFile = path.join(logsDir, filename);
    fs.appendFileSync(logFile, message + '\n');
  },

  // HTTP request logger middleware
  httpLogger: (req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      const logMessage = `${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms - ${req.ip}`;
      
      if (res.statusCode >= 400) {
        logger.error(logMessage);
      } else {
        logger.info(logMessage);
      }
    });
    
    next();
  }
};

module.exports = logger;
