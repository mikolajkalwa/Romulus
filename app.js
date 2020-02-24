require('dotenv').config();
require('./db');
const { prefix } = require('./config');

const logger = require('./util/logger');
const bot = require('./bot');

process.on('uncaughtException', (error) => {
  logger.fatal(error.message);
  logger.fatal(error.stack);
  process.exit(1);
});

(async () => {
  await bot.login(process.env.BOT_TOKEN);
  bot.user.setActivity(`Prefiks do komend: ${prefix || 'r:'}`);
})();
