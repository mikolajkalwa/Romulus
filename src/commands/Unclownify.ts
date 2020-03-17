import {
  Command, KlasaClient, CommandStore, KlasaMessage,
} from 'klasa';
import { GuildMember } from 'discord.js';
import User from '../models/User';

export default class extends Command {
  constructor(client: KlasaClient, store: CommandStore, file: string[], dir: string) {
    super(client, store, file, dir, {
      name: 'odklaunij',
      enabled: true,
      permissionLevel: 6,
      usage: '<member:member>',
      runIn: ['text'],
      description: 'Przywraca użytkownikowi rozum i godność człowieka.',
    });
  }

  // @ts-ignore
  async run(message: KlasaMessage, [member]: [GuildMember]) {
    const user = await User.findOne({ id: member.id });
    if (!user) {
      return message.reply('Nie znaleziono tego użytkownika w bazie!');
    }
    user.set({ isClown: false });
    await user.save();
    return message.reply('Ok');
  }
}
