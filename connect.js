const net = require('net');

const client = new net.Socket();

let gridSize;

const signUp = () => client.write('eTron');

/* Mise à jour des positions ennemies */
const updateEnemies = () => {
	buffer.logs.slice(1).forEach((enemy, index) => {
		let [y, x] = enemy.split`,`;
		[enemies[index].y, enemies[index].x] = [y, x];
		if (buffer.logs.length > 2) history.add(`(${y}, ${x})`);
	});
};

/* -------------------------------------------------------- */

/* Données reçues à chaque tour de jeu */
const buffer = {
	logs: [],
	decode: (data) => buffer.logs = data.toString('utf8').replace(/:/ig, ',').split`;`
};


/* Notre pion */
const eTron = {
	y: -1, // Colonne
	x: -1, // Ligne
	prev: "",
	move: data => {
		const moves = ["DOWN", "UP", "LEFT", "RIGHT"];
		let canMove = false;
		let next;
		buffer.decode(data);

		if (buffer.logs.length == 1) console.log(`Je suis le joueur ${buffer.logs}`);

		else if (buffer.logs.length == 2) {
			gridSize = buffer.logs[0];
			[eTron.y, eTron.x] = buffer.logs[1].split`,`;
			console.log(`La grille est de ${gridSize}, et je suis en ${buffer.logs[1]}`);
			history.add(`${buffer.logs[1].split`,`[0]}, ${buffer.logs[1].split`,`[1]})`);
		}
		if (buffer.logs.length >= 2) {
			updateEnemies();
			if (buffer.logs.length > 2) [eTron.y, eTron.x] = buffer.logs[0].split`,`;

			do {
				moves.splice(moves.indexOf(eTron.prev), 1);
				next = moves[~~(Math.random() * moves.length)];

				console.log(`Je suis en ${eTron.y}, ${eTron.x} et je vais dans la direction: ${next}.`);
				//console.log(history);

				switch (next) {
					case "UP":
						if (eTron.x - 1 >= 0 && !history.has(`(${eTron.y}, ${eTron.x - 1})`)) {
							canMove = true;
							eTron.prev = "DOWN";
						} else {
							eTron.prev = next;
						}
						break;
					case "DOWN":
						if (eTron.x + 1 < gridSize && !history.has(`(${eTron.y}, ${eTron.x + 1})`)) {
							canMove = true;
							eTron.prev = "UP";
						} else {
							eTron.prev = next;
						}
						break;
					case "LEFT":
						if (eTron.y - 1 >= 0 && !history.has(`(${eTron.y - 1}, ${eTron.x})`)) {
							canMove = true;
							eTron.prev = "RIGHT";
						} else {
							eTron.prev = next;
						}
						break;
					case "RIGHT":
						if (eTron.y + 1 < gridSize && !history.has(`(${eTron.y + 1}, ${eTron.x})`)) {
							canMove = true;
							eTron.prev = "LEFT";
						} else {
							eTron.prev = next;
						}
						break;
					default:
						console.log("Tanpijemeur");
				}
			} while (!canMove);

			history.add(`(${eTron.y}, ${eTron.x})`);
			client.write(next);
		}
	}
};

/* Position des bots */
const enemies = [{y: -1, x: -1},
				 {y: -1, x: -1},
				 {y: -1, x: -1}];

// Contient toutes les cases déjà parcourues
const history = new Set();

/* -------------------------------------------------------- */

client.connect(8000, '127.0.0.1', signUp);
client.on('data', eTron.move);
