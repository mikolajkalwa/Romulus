import { Event, KlasaClient, EventStore } from 'klasa';

import { Presence } from 'discord.js';
import { updateOnline } from '../util/updateStats';

const onlineStatus = ['online', 'dnd', 'idle'];

export default class extends Event {
  constructor(client: KlasaClient, store: EventStore, file: string[], dir: string) {
    super(client, store, file, dir, {
      name: 'presenceUpdate',
      enabled: true,
      event: 'presenceUpdate',
    });
  }

  async run(oldPresence: Presence, newPresence: Presence) {
    if ((oldPresence && newPresence.member)
      && ((onlineStatus.includes(oldPresence.status) && newPresence.status === 'offline')
        || (oldPresence.status === 'offline' && onlineStatus.includes(newPresence.status)))) {
      updateOnline(this.client, newPresence.member);
    }
  }
}
