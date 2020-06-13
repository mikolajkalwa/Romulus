import { Message } from 'eris';
import User from '../models/User';

const isDate = (dateToCheck: string) => {
  if (/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])$/g.test(dateToCheck)) {
    return true;
  }
  return false;
};

export default {
  label: 'urodziny',
  generator: async (msg: Message, args: Array<string>) => {
    if (!isDate(args[0])) {
      return 'Podano  datę w nieprawidłowym formacie';
    }

    const fetchedUser = await User.findOne({ id: msg.author.id });
    if (fetchedUser) {
      if (fetchedUser.birthday) {
        return 'Już masz ustawioną datę urodzin.';
      }
      fetchedUser.set({ birthday: args[0] });
      await fetchedUser.save();
    } else {
      const user = new User({
        id: msg.author.id,
        birthday: args[0]
      });
      await user.save();
    }
    return `Ustawiono datę urodzin na ${args[0]}`;
  },
  options: {
    argsRequired: true,
    description: 'Ustawia date urodzin',
    fullDescription: 'Ustawia dzień urodzin. W dniu urodzin użytkownik dostaje specjalną range solenizant. Data jest w formacie DD-MM. Na przykład: 11-01 oznacza 11 stycznia. Datę urodzin mozna ustawić tylko raz, nie można jej później zmienić! Więc jak ustawisz sobie jako dzień urodzin 31 lutego to masz problem szanowny kolego.',
    usage: 'r:urodziny 14-04 = ustawia urodziny na 14 kwietnia',
    errorMessage: 'Coś nie pykło',
    guildOnly: true
  }
};
