import { CommandClient, CommandClientOptions, ClientOptions } from 'eris';
import config from './config';

const clientOptions: ClientOptions = {
  disableEvents: {
    TYPING_START: true
  },
  intents: [
    'guildMembers'
  ]
};

const commandOptions: CommandClientOptions = {
  description: 'Najlepszy bocik na tym serwerze',
  prefix: ['r:', '@mention']
};
const bot = new CommandClient(config.BOT_TOKEN, clientOptions, commandOptions);

export default bot;
