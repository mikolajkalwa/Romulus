const { Event } = require('klasa');
const updateStats = require('../util/updateStats');

module.exports = class extends Event {
  constructor(...args) {
    super(...args, {
      name: 'guildMemberAdd',
      enabled: true,
      event: 'guildMemberAdd',
    });
  }

  async run(member) {
    updateStats(this.client, member);
  }
};
