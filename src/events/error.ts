import logger from '../logger';
export default {
  event: 'error',
  generator: (err: Error, id: number) => {
    logger.error(`Shard ${id}: ${err}`);
    throw err;
  }
};
