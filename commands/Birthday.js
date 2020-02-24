const { Command } = require('klasa');
const User = require('../models/User');
const isDate = require('../util/isDate');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: 'urodziny',
      enabled: true,
      usage: '<data:string>',
      runIn: ['text'],
      description: 'Ustawia dzień urodzin. W dniu urodzin użytkownik dostaje specjalną range solenizant. Data jest w formacie DD-MM. Na przykład: 11-01 oznacza 11 stycznia. Datę urodzin mozna ustawić tylko raz, nie można jej później zmienić! Więc jak ustawisz sobie jako dzień urodzin 31 lutego to masz problem szanowny kolego.',
    });
  }

  async run(message, [birthdayDate]) {
    if (!isDate(birthdayDate)) {
      return message.reply('Podano datę w nieprawidłowym formacie');
    }
    const fetchedUser = await User.findOne({ id: message.author.id });
    if (fetchedUser) {
      if (fetchedUser.birthday) {
        return message.reply('Już masz ustawioną datę urodzin.');
      }
      fetchedUser.set({ birthday: birthdayDate });
      await fetchedUser.save();
    } else {
      const user = new User({
        id: message.author.id,
        birthday: birthdayDate,
      });
      await user.save();
    }
    return message.reply(`Ustawiono datę urodzin na ${birthdayDate}`);
  }
};
