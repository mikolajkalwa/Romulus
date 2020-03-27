import {
  Command, KlasaClient, CommandStore, KlasaMessage,
} from 'klasa';
import axios from 'axios';
import cheerio from 'cheerio';
import { MessageEmbed } from 'discord.js';
import { IDefinition } from '../interfaces/IDefinition';

export default class DefineCommand extends Command {
  constructor(client: KlasaClient, store: CommandStore, file: string[], dir: string) {
    super(client, store, file, dir, {
      name: 'definiuj',
      enabled: true,
      usage: '<query:string>',
      runIn: ['text'],
      description: 'Wyszukuje definicji podanego słowa w serwisie miejski.pl',
    });
  }

  private static prepareMessage(defintion: IDefinition) {
    const messageEmbed = new MessageEmbed();
    messageEmbed.setURL(defintion.url);
    messageEmbed.setTitle(`Definicja wyrazu ${defintion.query}`);
    messageEmbed.addField('Definicja', defintion.definition);
    if (defintion.example.length) {
      messageEmbed.addField('Przykład', defintion.example);
    }
    messageEmbed.setFooter(defintion.date);
    return messageEmbed;
  }

  async run(message: KlasaMessage, params: any[]) {
    const query = params[0] as string;
    const encodeQuery = encodeURI(query.replace(/ /g, '+'));
    const url = `https://www.miejski.pl/slowo-${encodeQuery}`;
    const response = await axios.get(url, { validateStatus: () => true });
    if (response.status === 404) {
      message.reply('Nie udało się odnaleźć definicji dla podanego wyrazu!');
    } else if (response.status === 200) {
      const $ = cheerio.load(response.data);
      const definitionNode = $('li', '#words').first();
      const isPending = !!$('.pending', definitionNode).length;
      if (isPending) {
        message.reply('Definicja znajduje się aktualnie w poczekalni.');
        return null;
      }
      const definition = $('.definition', definitionNode).text().trim();
      const example = $('.example', definitionNode).text().trim();
      const date = $('.info:contains("Data dodania:")', definitionNode).text().trim();
      const definitionMessage = DefineCommand.prepareMessage({
        url, query, definition, example, date,
      });
      message.reply(definitionMessage);
    } else {
      message.reply(`Coś poszło nie tak! ${response.status}`);
      this.client.console.warn(`Miejski.pl zwrócił status ${response.status}`);
    }

    return null;
  }
}
