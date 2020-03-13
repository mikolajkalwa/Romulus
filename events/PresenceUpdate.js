const { Event } = require('klasa');
const updateStats = require('../util/updateStats');

const onlineStatus = ['online', 'dnd', 'idle'];

module.exports = class extends Event {
  constructor(...args) {
    super(...args, {
      name: 'presenceUpdate',
      enabled: true,
      event: 'presenceUpdate',
    });
  }

  async run(oldPresence, newPresence) {
    if (oldPresence
      && ((onlineStatus.includes(oldPresence.status) && newPresence.status === 'offline')
        || (oldPresence.status === 'offline' && onlineStatus.includes(newPresence.status)))) {
      updateStats(this.client, newPresence.member);
    }
  }
};
