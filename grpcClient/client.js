const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const config = require('./config');

if (process.argv.length < 3) {
  process.exit(1);
}

const action = process.argv[2];
if (action === 'birthday' || action === 'statistics') {
  const protoPath = path.resolve(__dirname, '..', 'rpc.proto');

  const packageDefinition = protoLoader.loadSync(protoPath);
  const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

  const client = new protoDescriptor.Romulus(config.grpcServerAddress, grpc.credentials.createInsecure());

  if (action === 'birthday') {
    client.birthdayRoleUpdate({}, (err, response) => {
      if (err) {
        console.error('Coś się zjebało po stronie grpc', err);
      } else {
        console.log('Status operacji akutlaizacji urodzinek', response.isSuccess);
      }
    });
  }

  if (action === 'statistics') {
    client.serverStatisticsUpdate({}, (err, response) => {
      if (err) {
        console.error('Coś się zjebało po stronie grpc', err);
      } else {
        console.log('Status operacji akutlaizacji urodzinek', response.isSuccess);
      }
    });
  }
} else {
  process.exit(2);
}
