const { Event } = require('klasa');
const updateStats = require('../util/updateStats');

module.exports = class extends Event {
  constructor(...args) {
    super(...args, {
      name: 'guildMemberRemove',
      enabled: true,
      event: 'guildMemberRemove',
    });
  }

  async run(member) {
    updateStats(this.client, member);
  }
};
