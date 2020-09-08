import './env';
import fs from 'fs';
import path from 'path';
import { CronJob } from 'cron';
import bot from './bot';
import logger from './logger';
import './db';
import updateBirthday from './miscellaneous/updateBirthday';

process.on('unhandledRejection', (reason) => {
  throw reason;
});

process.on('uncaughtException', (error) => {
  logger.error(error);
  process.exit(1);
});

/** Gets only .js files from a directory. Ignores .map.js etc */
const getModules = (directory: string) => {
  const files = fs.readdirSync(directory).filter(name => {
    const extension = name.substr(name.indexOf('.'));
    if (extension === '.js') {
      return true;
    }
  });
  return files;
};

const loadEvents = async () => {
  const files = getModules(path.resolve(__dirname, 'events'));
  for (const file of files) {
    const event = await import(path.resolve(__dirname, 'events', file));
    logger.info(`Loading event: ${event.default.event}`);
    bot.on(event.default.event, event.default.generator);
  }
};

const loadCommands = async () => {
  const files = getModules(path.resolve(__dirname, 'commands'));
  for (const file of files) {
    const command = await import(path.resolve(__dirname, 'commands', file));
    logger.info(`Loading command: ${command.default.label}`);
    bot.registerCommand(command.default.label, command.default.generator, command.default?.options);
  }
};

(async () => {
  await Promise.all([loadEvents(), loadCommands()]);
  logger.info('Finished loading commands and events!');
  await bot.connect();
  const job = new CronJob('0 8 * * *', updateBirthday, null, true, 'Europe/Warsaw');
})();
