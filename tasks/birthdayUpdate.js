const { Task } = require('klasa');
const User = require('../models/User');
const logger = require('../util/logger');
const { birthdayGuild, birthdayRole, birthdayChannel } = require('../config');

module.exports = class RoleUpdater extends Task {
  async run() {
    const removeRoles = [];
    const guild = this.client.guilds.get(birthdayGuild);
    const members = await guild.members.fetch();
    members.forEach((member) => {
      if (member.roles.has(birthdayRole)) {
        removeRoles.push(member.roles.remove(birthdayRole));
      }
    });
    await Promise.all(removeRoles);
    const date = new Date();
    const dateString = `${(`0${date.getDate()}`).slice(-2)}-${(`0${date.getMonth() + 1}`).slice(-2)}`;
    const fetchedUsers = await User.find({ birthday: dateString });
    const birthdayUsersIds = [];
    fetchedUsers.forEach((user) => {
      birthdayUsersIds.push(user.id);
    });
    const birthdayMembers = members.filter((member) => birthdayUsersIds.includes(member.id));
    if (birthdayMembers.size > 0) {
      const addRoles = [];
      birthdayMembers.forEach((member) => {
        addRoles.push(member.roles.add(birthdayRole));
      });
      await Promise.all(addRoles);
      const channel = await this.client.channels.fetch(birthdayChannel);
      const mentions = birthdayMembers.map((member) => `<@${member.id}>`);
      await channel.send(`:partying_face:  Wszystkiego najelpszego z okazji urodzin! ${mentions.join(' ')}`);
    }

    logger.info(
      `Birthday roles update!
      Removed ${removeRoles.length}
      Added ${birthdayMembers.length ? birthdayMembers.length : 0}
    `,
    );
  }
};
