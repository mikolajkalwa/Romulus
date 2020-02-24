const { Command } = require('klasa');
const User = require('../models/User');
const clownify = require('../util/clownify');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: 'klaun',
      enabled: true,
      permissionLevel: 6,
      usage: '<member:member>',
      runIn: ['text'],
      description: 'Zmienia użytkownika w klauna.',
    });
  }

  async run(message, [member]) {
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
    return message.reply('Ok');
  }
};
