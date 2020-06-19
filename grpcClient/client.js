const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const config = require('./config');

const currentDate = new Date().toISOString();
const protoPath = path.resolve(__dirname, '..', 'rpc.proto');

const packageDefinition = protoLoader.loadSync(protoPath);
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

const client = new protoDescriptor.Romulus(config.grpcServerAddress, grpc.credentials.createInsecure());

client.birthdayRoleUpdate({}, (err, response) => {
  if (err) {
    console.error(currentDate, 'Błąd po stronie gRPC', err);
  } else {
    console.log(currentDate, 'Czy zaktulizowano role urodzinowe z sukcsesem: ', response.isSuccess);
  }
});
