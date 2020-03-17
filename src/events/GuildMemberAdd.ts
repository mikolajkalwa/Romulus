import { Event, KlasaClient, EventStore } from 'klasa';
import { GuildMember } from 'discord.js';

import { updateTotal } from '../util/updateStats';

export default class extends Event {
  constructor(client: KlasaClient, store: EventStore, file: string[], dir: string) {
    super(client, store, file, dir, {
      name: 'guildMemberAdd',
      enabled: true,
      event: 'guildMemberAdd',
    });
  }

  async run(member: GuildMember) {
    updateTotal(this.client, member);
  }
}
