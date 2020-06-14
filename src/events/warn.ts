import logger from '../logger';
export default {
  event: 'warn',
  generator: (message: string, id: number) => {
    logger.warn(`Shard ${id}: ${message}`);
  }
};
