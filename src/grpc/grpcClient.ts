import path from 'path';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
const protoPath = path.resolve(__dirname, 'action.proto');

const packageDefinition = protoLoader.loadSync(protoPath);
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

const client = new protoDescriptor.Romulus('localhost:50051', grpc.credentials.createInsecure());

let action;
if (process.argv.length >= 3) {
  action = process.argv[2];
} else {
  action = 'default action';
}

client.doAction({ actionType: action }, function (err, response) {
  console.log(response.actionReply);
});

// TODO: napisac klientow do aktualizacji roli urodzinowych (odpalane codzinne z crone o 8) i do aktualizacji kanałow z cyferkami (odpalane co 5 minut)
