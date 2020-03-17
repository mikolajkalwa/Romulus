import { Event, EventStore, KlasaClient } from 'klasa';
import { GuildMember } from 'discord.js';
import { updateTotal } from '../util/updateStats';

module.exports = class extends Event {
  constructor(client: KlasaClient, store: EventStore, file: string[], dir: string) {
    super(client, store, file, dir, {
      name: 'guildMemberRemove',
      enabled: true,
      event: 'guildMemberRemove',
    });
  }

  async run(member: GuildMember) {
    updateTotal(this.client, member);
  }
};
