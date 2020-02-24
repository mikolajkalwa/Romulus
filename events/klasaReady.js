const { Event } = require('klasa');

module.exports = class extends Event {
  async run() {
    if (!this.client.settings.schedules.some((task) => task.taskName === 'birthdayUpdate')) {
      await this.client.schedule.create('birthdayUpdate', '0 7 * * *', { catchUp: false });
    }
  }
};
