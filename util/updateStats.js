const { mainGuildId, onlineCountChannelId, allUsersCountChannelId } = require('../config');

const updateStats = (client, member) => {
  if (member.guild.id !== mainGuildId) {
    return;
  }
  client.channels.get(onlineCountChannelId).setName(`» Fanów: ${member.guild.memberCount}`);
  client.channels.get(allUsersCountChannelId).setName(`» Online: ${member.guild.members.filter((m) => m.user.presence.status !== 'offline').size}`);
};

module.exports = updateStats;
