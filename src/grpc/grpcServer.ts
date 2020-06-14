import path from 'path';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import logger from '../logger';
import bot from '../bot';
import config from '../config';
import { VoiceChannel, TextChannel } from 'eris';
import User from '../models/User';

const protoPath = path.resolve(__dirname, '..', '..', 'rpc.proto');
const packageDefinition = protoLoader.loadSync(protoPath);
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

// @ts-ignore
const birthdayRoleUpdate = async (call, callback) => {
  try {
    logger.debug('birthdayRoleUpdate');
    const rulalosGuild = bot.guilds.find(guild => guild.id === config.RULALOS_GUILD_ID);
    const removingBirthdayRole: Promise<void>[] = [];
    await rulalosGuild?.fetchAllMembers();

    // eslint-disable-next-line no-unused-expressions
    rulalosGuild?.members.forEach(member => {
      if (member.roles.includes(config.BIRTHDAY_ROLE_ID)) {
        removingBirthdayRole.push(member.removeRole(config.BIRTHDAY_ROLE_ID, 'Urodziny się skończyły'));
      }
    });
    await Promise.all(removingBirthdayRole);

    const date = new Date();
    const dayMonthString = `${(`0${date.getDate()}`).slice(-2)}-${(`0${date.getMonth() + 1}`).slice(-2)}`;
    const birthdayUsersIDs = (await User.find({ birthday: dayMonthString })).map(member => member.id);
    if (birthdayUsersIDs.length > 0) {
      const birthdayMembers = rulalosGuild?.members.filter(member => birthdayUsersIDs.includes(member.id));

      const rolesUpdate: Promise<void>[] = [];

      // eslint-disable-next-line no-unused-expressions
      birthdayMembers?.forEach(member => {
        rolesUpdate.push(member.addRole(config.BIRTHDAY_ROLE_ID));
      });

      await Promise.all(rolesUpdate);
      const birthdayChannel = bot.getChannel(config.HAPPY_BIRTHDAY_CHANNEL) as TextChannel;
      await birthdayChannel.editPermission(config.RULALOS_GUILD_ID, 2048, 0, 'role', 'Pozwól składać życzenia urodzinowe');
      const mentions = birthdayUsersIDs.map(id => `<@${id}>`);
      await birthdayChannel.createMessage(`:partying_face:  Wszystkiego najlepszego z okazji urodzin! ${mentions.join(' ')}`);
    } else {
      await (bot.getChannel(config.HAPPY_BIRTHDAY_CHANNEL) as TextChannel).editPermission(config.RULALOS_GUILD_ID, 0, 2048, 'role', 'Nikt nie ma urodzin');
    }
    callback(null, { isSuccess: true });
  } catch (error) {
    logger.error(`Coś się wyhuśtało przy aktualizacji urodzin ${error}`);
    callback(null, { isSuccess: false });
  }
};

// @ts-ignore
const serverStatisticsUpdate = async (call, callback) => {
  // TODO to by trzeba bylo czytac z jakiegoś pliku i do niego zapisywac. W bocie na eventach kiedy ktoś się robi online a kiedy offline itp
  logger.debug('serverStatisticsUpdate');
  const rulalosGuild = bot.guilds.find(guild => guild.id === config.RULALOS_GUILD_ID);
  const onlineUsersCount = rulalosGuild?.members.filter(member => member.status !== 'offline').length;
  try {
    await Promise.all([
      (bot.getChannel(config.TOTAL_USERS_CHANNEL) as VoiceChannel).edit({ name: `» Fanów: ${rulalosGuild?.memberCount}` }),
      (bot.getChannel(config.ONLINE_USERS_CHANNEL) as VoiceChannel).edit({ name: `» Online: ${onlineUsersCount}` })
    ]);
    callback(null, { isSuccess: true });
  } catch (error) {
    logger.error(`Coś się wyhuśtało przy aktualizacji kanałow ze statystkami ${error}`);
    callback(null, { isSuccess: false });
  }
};

const server = new grpc.Server();

// @ts-ignore
server.addService(protoDescriptor.Romulus.service, { birthdayRoleUpdate, serverStatisticsUpdate });
server.bindAsync(config.GRPC, grpc.ServerCredentials.createInsecure(), (err) => {
  if (err) { throw err; }
  logger.info('Starting gRPC server!');
  server.start();
});
