const net = require('net');

let laps = 0;

const client = new net.Socket();
client.connect(8000, '127.0.0.1', (data) => {
	client.write('e-tron');
	console.log(data);
});

client.on('data', (data) => {
	if (laps++ != 0)
		client.write("DOWN");
	console.table(data.toString('utf8').split(";"));
});



client.on('close', () => {
	console.log('fermé');
});
