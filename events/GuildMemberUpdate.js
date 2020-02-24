const { Event } = require('klasa');
const User = require('../models/User');
const clownify = require('../util/clownify');
const { notAllowedPrefixes, clownEmoji, clownImmuneRoles } = require('../config');

module.exports = class extends Event {
  constructor(...args) {
    super(...args, {
      name: 'guildMemberUpdate',
      enabled: true,
      event: 'guildMemberUpdate',
    });
  }

  async run(_oldMember, newMember) {
    const userRolesIds = Array.from(newMember.roles.keys());
    if (
      newMember.user.bot
      || (newMember.nickname && newMember.nickname.startsWith(clownEmoji))
      || newMember.id === newMember.guild.ownerID
      || userRolesIds.some((v) => clownImmuneRoles.includes(v))
    ) {
      return;
    }

    const user = await User.findOne({ id: newMember.id });

    if (
      (user && user.isClown)
      || (newMember.nickname && notAllowedPrefixes.includes(newMember.nickname.charAt(0)))
      || (!newMember.nickname && notAllowedPrefixes.includes(newMember.user.username.charAt(0)))
    ) {
      await clownify(newMember);
    }
  }
};
