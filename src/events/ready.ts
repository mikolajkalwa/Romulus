import logger from '../logger';
export default {
  event: 'ready',
  generator: () => {
    logger.info('Ready!');
  }
};
