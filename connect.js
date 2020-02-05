const net = require('net');

const client = new net.Socket();

const signUp = () => client.write('e-tron');

const updateEnemies = () => {
	buffer.log.slice(1).forEach((e, i) => {
		[enemies[i].y, enemies[i].x] = e.split`,`;
		console.log(`Client ${i+1}`);
		console.table(enemies[i]);
	});
};

/* -------------------------------------------------------- */

/* Données reçues à chaque tour de jeu */
const buffer = {
	log: [],
	decode: (data) => buffer.log = data.toString('utf8').replace(/:/ig, ',').split`;`
};

/* Notre pion */
const etron = {
	y: 0,
	x: 0,
	move: data => {
		buffer.decode(data);

		buffer.log.length == 1 && console.log(`je suis le joueur ${buffer.log}`);

		buffer.log.length == 2 && console.log(`La grille est de ${buffer.log[0]}, et je suis en ${buffer.log[1]}`);

		if (buffer.log.length >= 2) {
			updateEnemies();
			client.write("DOWN");
			[etron.x, etron.y] = buffer.log[0].split`,`;
			//console.table({etron.x, etron.y});
		}
	}
};

/* Position des bots */
const enemies = [{y: -1, x: -1},
				 {y: -1, x: -1},
				 {y: -1, x: -1}];

/* -------------------------------------------------------- */

client.connect(8000, '127.0.0.1', signUp);
client.on('data', etron.move);
