import pino from 'pino';

const logger = pino({
  name: 'romulus',
  level: 'debug',
});

export default logger;
