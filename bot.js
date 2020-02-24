const { KlasaClient } = require('klasa');

const bot = new KlasaClient({
  prefix: 'r:',
  disabledEvents: ['TYPING_START'],
  readyMessage: (client) => `Successfully initialized. Logged in as ${client.user.username}.`,
});

module.exports = bot;
