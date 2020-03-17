import { GuildMember } from 'discord.js';
import config from '../config';

const { clownEmoji } = config;

const truncateNickname = (nickname: string) => {
  const { length } = nickname;
  if (length <= 32) {
    return nickname;
  }

  const charsToCut = (length - 32) * -1;
  return nickname.slice(0, charsToCut);
};

// FIXME: zmienić na optional chaining
const clownify = async (member: GuildMember) => {
  // user ma nick ktory nie zaczyna sie od klauna
  if (member.nickname && !member.nickname.startsWith(clownEmoji)) {
    await member.setNickname(truncateNickname(`🤡 ${member.nickname}`));
  } else if (!member.user.username.startsWith(clownEmoji)) {
    // jak user nie ma nicka to bierzemy jego username
    await member.setNickname(truncateNickname(`🤡 ${member.user.username}`));
  }
};

export default clownify;
