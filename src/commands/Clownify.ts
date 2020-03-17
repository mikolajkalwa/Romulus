import {
  Command, KlasaClient, CommandStore, KlasaMessage,
} from 'klasa';
import { GuildMember } from 'discord.js';
import User from '../models/User';
import clownify from '../util/clownify';

export default class extends Command {
  constructor(client: KlasaClient, store: CommandStore, file: string[], dir: string) {
    super(client, store, file, dir, {
      name: 'klaun',
      enabled: true,
      permissionLevel: 6,
      usage: '<member:member>',
      runIn: ['text'],
      description: 'Zmienia użytkownika w klauna.',
    });
  }

  async run(message: KlasaMessage, args: any[]) {
    const member = args[0] as GuildMember;
    const fetchedUser = await User.findOne({ id: member.id });
    if (!fetchedUser) {
      const user = new User({
        id: member.id,
        isClown: true,
      });
      await user.save();
    } else {
      fetchedUser.set({ isClown: true });
      await fetchedUser.save();
    }
    await clownify(member);
    message.reply('Ok');
    return null;
  }
}
