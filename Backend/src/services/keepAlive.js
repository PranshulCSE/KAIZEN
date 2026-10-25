const logger = require('../utils/logger.js');

/**
 * Keep-Alive Service
 * Prevents free cloud hosting tiers (e.g. Render, Koyeb, Railway) from going to sleep
 * by pinging the /health endpoint every 12 minutes (720,000 ms).
 * Render's free tier spins down after 15 minutes of inactivity.
 */
function startKeepAlive() {
  const targetUrl = process.env.KEEP_ALIVE_URL || process.env.RENDER_EXTERNAL_URL || process.env.SERVER_URL;

  if (!targetUrl) {
    logger.info('Keep-alive service idle: No KEEP_ALIVE_URL or RENDER_EXTERNAL_URL configured. (Set KEEP_ALIVE_URL in Backend/.env with your backend URL to keep it awake 24/7)');
    return;
  }

  const cleanUrl = targetUrl.replace(/\/+$/, '');
  const healthEndpoint = `${cleanUrl}/health`;
  const PING_INTERVAL_MS = 12 * 60 * 1000; // 12 minutes

  logger.info(`✓ Keep-alive service active. Pinging ${healthEndpoint} every 12 minutes.`);

  const ping = async () => {
    try {
      const res = await fetch(healthEndpoint, {
        method: 'GET',
        headers: { 'User-Agent': 'Kaizen-KeepAlive-Ping/1.0' },
        signal: AbortSignal.timeout(15000),
      });

      if (res.ok) {
        logger.info(`Keep-alive ping successful (${res.status}) at ${new Date().toLocaleTimeString()}`);
      } else {
        logger.warn(`Keep-alive ping returned HTTP ${res.status}`);
      }
    } catch (err) {
      logger.warn(`Keep-alive ping failed: ${err.message}`);
    }
  };

  // Perform initial ping after 1 minute, then interval
  setTimeout(ping, 60 * 1000);
  setInterval(ping, PING_INTERVAL_MS);
}

module.exports = { startKeepAlive };
