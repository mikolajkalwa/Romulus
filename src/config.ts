export default {
  // TODO: dodac adres do mongodb do zmiennnych srodowiskowtych
  BOT_TOKEN: process.env.BOT_TOKEN ?? '',
  MONGO_URL: process.env.MONGO_URL ?? '',
  WEATHER: process.env.DARKSKY ?? '',
  MAPBOX: process.env.MAPBOX ?? '',
  BOT_OWNER_ID: process.env.BOT_OWNER_ID ?? '172012484306141184',
  GRPC: process.env.gRPC ?? 'localhost:50051',
  RULALOS_GUILD_ID: process.env.RULALOS_GUILD_ID ?? '',
  TOTAL_USERS_CHANNEL: process.env.TOTAL_USERS_CHANNEL ?? '',
  ONLINE_USERS_CHANNEL: process.env.ONLINE_USERS_CHANNEL ?? '',
  BIRTHDAY_ROLE_ID: process.env.BIRTHDAY_ROLE_ID ?? '',
  HAPPY_BIRTHDAY_CHANNEL: process.env.HAPPY_BIRTHDAY_CHANNEL ?? ''
};
