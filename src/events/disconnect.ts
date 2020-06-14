import logger from '../logger';
export default {
  event: 'disconnect',
  generator: () => {
    logger.info('All shards disconnected!');
  }
};
