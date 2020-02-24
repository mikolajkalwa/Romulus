const { KlasaClient } = require('klasa');
const { prefix } = require('./config');

const bot = new KlasaClient({
  prefix: prefix || 'r:',
  language: 'pl-PL',
  disabledEvents: ['TYPING_START'],
  readyMessage: (client) => `Successfully initialized. Logged in as ${client.user.username}.`,
});

module.exports = bot;
