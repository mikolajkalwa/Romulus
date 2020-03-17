import { KlasaClient } from 'klasa';
import { GuildMember, VoiceChannel } from 'discord.js';
import config from '../config';

const { mainGuildId, onlineCountChannelId, allUsersCountChannelId } = config;

const updateOnline = (client: KlasaClient, member: GuildMember) => {
  if (member.guild.id !== mainGuildId) {
    return;
  }
  (client.channels.get(onlineCountChannelId)! as VoiceChannel).setName(`» Online: ${member.guild.members.filter((m) => m.user.presence.status !== 'offline').size}`);
};

const updateTotal = (client: KlasaClient, member: GuildMember) => {
  if (member.guild.id !== mainGuildId) {
    return;
  }
  (client.channels.get(allUsersCountChannelId)! as VoiceChannel).setName(`» Fanów: ${member.guild.memberCount}`);
};

export { updateOnline, updateTotal };
