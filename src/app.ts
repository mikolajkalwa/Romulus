import './util/env';
import bot from './bot';
import './db';
import config from './config';


process.on('uncaughtException', (error) => {
  bot.emit('error', error.stack);
  process.exit(1);
});

(async () => {
  await bot.login(process.env.BOT_TOKEN);
  bot.user!.setActivity(`Prefiks do komend: ${config.prefix || 'r:'}`);
})();
