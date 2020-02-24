// te nazwy class są coraz lepsze
const { Command } = require('klasa');
const User = require('../models/User');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: 'odklaunij',
      enabled: true,
      permissionLevel: 6,
      usage: '<member:member>',
      runIn: ['text'],
      description: 'Przywraca użytkownikowi rozum i godność człowieka.',
    });
  }

  async run(message, [member]) {
    const user = await User.findOne({ id: member.id });
    if (!user) {
      return message.reply('Nie znaleziono tego użytkownika w bazie!');
    }
    user.set({ isClown: false });
    await user.save();
    return message.reply('Ok');
  }
};
