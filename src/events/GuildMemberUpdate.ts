import { Event, KlasaClient, EventStore } from 'klasa';
import { GuildMember } from 'discord.js';
import User from '../models/User';
import clownify from '../util/clownify';
import config from '../config';

const { notAllowedPrefixes, clownEmoji, clownImmuneRoles } = config;

export default class extends Event {
  constructor(client: KlasaClient, store: EventStore, file: string[], dir: string) {
    super(client, store, file, dir, {
      name: 'guildMemberUpdate',
      enabled: true,
      event: 'guildMemberUpdate',
    });
  }

  async run(_oldMember: GuildMember, newMember: GuildMember) {
    const userRolesIds = Array.from(newMember.roles.keys());
    if (
      newMember.user.bot
      || newMember.nickname?.startsWith(clownEmoji)
      || newMember.id === newMember.guild.ownerID
      || userRolesIds.some((v) => clownImmuneRoles.includes(v))
    ) {
      return;
    }

    const user = await User.findOne({ id: newMember.id });

    if (
      user?.isClown
      || (newMember.nickname && notAllowedPrefixes.includes(newMember.nickname.charAt(0)))
      || (!newMember.nickname && notAllowedPrefixes.includes(newMember.user.username.charAt(0)))
    ) {
      await clownify(newMember);
    }
  }
}
