import './util/env';
import './db';
import config from './config';
import logger from './util/logger';
import bot from './bot';


process.on('uncaughtException', (error) => {
  logger.fatal(error.message);
  logger.fatal(error.stack!);
  process.exit(1);
});

(async () => {
  await bot.login(process.env.BOT_TOKEN);
  bot.user!.setActivity(`Prefiks do komend: ${config.prefix || 'r:'}`);
})();
