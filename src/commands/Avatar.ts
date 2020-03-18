import {
  Command, KlasaClient, CommandStore, KlasaMessage,
} from 'klasa';
import { GuildMember, MessageEmbed } from 'discord.js';

export default class extends Command {
  constructor(client: KlasaClient, store: CommandStore, file: string[], dir: string) {
    super(client, store, file, dir, {
      name: 'avatar',
      enabled: true,
      usage: '<member:member>',
      runIn: ['text'],
      cooldown: 3600,
      bucket: 3,
      description: 'Pobiera avatar użytkownika',
    });
  }

  async run(message: KlasaMessage, params: any[]) {
    const member = params[0] as GuildMember;
    const embed = new MessageEmbed();
    embed.setImage(member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }));
    message.reply(embed);
    return null;
  }
}
