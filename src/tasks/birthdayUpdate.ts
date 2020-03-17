import { Task } from 'klasa';
import { GuildMember, TextChannel } from 'discord.js';
import User from '../models/User';
import config from '../config';

const { mainGuildId, birthdayRoleId, birthdayChannelId } = config;
export default class RoleUpdater extends Task {
  async run() {
    const removeRoles: Promise<GuildMember>[] = [];
    const guild = this.client.guilds.get(mainGuildId)!;
    const members = await guild.members.fetch();
    members.forEach((member) => {
      if (member.roles.has(birthdayRoleId)) {
        removeRoles.push(member.roles.remove(birthdayRoleId));
      }
    });
    await Promise.all(removeRoles);
    const date = new Date();
    const dateString = `${(`0${date.getDate()}`).slice(-2)}-${(`0${date.getMonth() + 1}`).slice(-2)}`;
    const fetchedUsers = await User.find({ birthday: dateString });
    const birthdayUsersIds: string[] = [];
    fetchedUsers.forEach((user) => {
      birthdayUsersIds.push(user.id);
    });
    const birthdayMembers = members.filter((member) => birthdayUsersIds.includes(member.id));
    if (birthdayMembers.size > 0) {
      const addRoles: Promise<GuildMember>[] = [];
      birthdayMembers.forEach((member) => {
        addRoles.push(member.roles.add(birthdayRoleId));
      });
      await Promise.all(addRoles);
      const channel = await this.client.channels.fetch(birthdayChannelId) as TextChannel;
      const mentions = birthdayMembers.map((member) => `<@${member.id}>`);
      await channel.send(`:partying_face:  Wszystkiego najelpszego z okazji urodzin! ${mentions.join(' ')}`);
    }

    this.client.emit('log',
      `Birthday roles update!
      Removed ${removeRoles.length}
      Added ${birthdayMembers.size}`);
  }
}
