import mongoose from 'mongoose';
import bot from './bot';

mongoose.connect(process.env.MONGO_URL!, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
}).catch((err) => {
  bot.console.error(`Failed to connect to mongoDB ${err.stack}`);
  process.exit(1);
});

mongoose.connection.on('connecting', () => {
  bot.console.log('Connecting to MongoDB...');
});

mongoose.connection.on('connected', () => {
  bot.console.log('Connected to MongoDB');
});

mongoose.connection.on('disconnecting', () => {
  bot.console.log('Disconnecting from MongoDB...');
});

mongoose.connection.on('disconnected', () => {
  bot.console.log('Disconnected from MongoDB');
});

mongoose.connection.on('close', () => {
  bot.console.log('Connection closed successfully');
});

mongoose.connection.on('reconnected', () => {
  bot.console.log('Mongoose connection restored');
});

mongoose.connection.on('error', (err) => {
  bot.console.error(`Mongoose default connection error: ${err}`);
});

mongoose.connection.on('reconnectFailed', () => {
  bot.console.wtf('Could not reconnect to MongoDB!');
  process.exit(1);
});

process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    bot.console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  } catch (e) {
    bot.console.log(`Mongoose default connection couldn't be closed ${e}`);
    process.exit(1);
  }
});
