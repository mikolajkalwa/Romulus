import { KlasaClient } from 'klasa';
import config from './config';

const bot = new KlasaClient({
  prefix: config.prefix ?? 'r:',
  language: 'pl-PL',
  disabledEvents: ['TYPING_START'],
  readyMessage: (client) => `Successfully initialized. Logged in as ${client.user!.username}.`,
});

export default bot;
