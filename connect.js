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
	if (!enemies.filter(enemy => enemy.y != -1 || enemy.x != -1).length) console.log("\x1b[32mJe gagne!\x1b[0m");
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
	illegal: "",
	/*
	 * Déplacement du pion
	 */
	move: data => {
		const moves = ["DOWN", "UP", "LEFT", "RIGHT"];
		let canMove = false;
		let next;
		let coord;

		let subGrid = [];

		buffer.decode(data);

		if (buffer.logs.length == 1) console.log(`Je suis le joueur ${buffer.logs}`); // 1ere réception de données

		else if (buffer.logs.length == 2) { // 2nde réception de données (initialisation de la taille de la grille et la position du joueur)
			gridSize = [...buffer.logs[0].split`,`];
			[eTron.y, eTron.x] = buffer.logs[1].split`,`;
			console.log(`La grille est de ${gridSize}, et je suis en ${buffer.logs[1]}`);
		}

		if (buffer.logs.length >= 2) { // Au delà de la 2nde réception
			updateEnemies(); // Mise à jour de la position des ennemis
			if (buffer.logs.length > 2) [eTron.y, eTron.x] = buffer.logs[0].split`,`; // À partir de la 3eme réception de données, le format est différent
			history.add(`(${eTron.y}, ${eTron.x})`); // On ajoute la position du joueur à l'historique
			console.log(gridSize[0]);

			do {
				moves.splice(moves.indexOf(eTron.illegal), 1); // On retire le mouvement illegal de la liste
				next = moves[~~(Math.random() * moves.length)]; // On choisir la prochaine direction parmi les possibilités restantes

				console.log(`Je suis en \x1b[33m(${eTron.y}, ${eTron.x})\x1b[0m,  et je vais dans la direction: \x1b[33m${next}\x1b[0m.`);

				/*
				 * Selon la direction choisie, on vérifie la disponibilité de la case ciblée.
				 * Si mouvement impossible on le marque comme illegal.
				 */
				switch (next) {
					case "UP":
						coord = `(${eTron.y}, ${1*eTron.x - 1})`;
						if (1*eTron.x - 1 >= 0 && !history.has(coord)) {
							console.log(`\x1b[32mJe peux aller en ${coord}\x1b[0m`);
							canMove = true;
						} else {
							console.log("\x1b[31mLa case est invalide, je change de direction.\x1b[0m");
							eTron.illegal = next;
						}
						break;
					case "DOWN":
						coord = `(${eTron.y}, ${1*eTron.x + 1})`;
						console.log(1*eTron.y + 1);
						if (1*eTron.x + 1 < gridSize[0] && !history.has(coord)) {
							console.log(`\x1b[32mJe peux aller en ${coord}\x1b[0m`);
							canMove = true;
						} else {
							console.log("\x1b[31mLa case est invalide, je change de direction.\x1b[0m");
							eTron.illegal = next;
						}
						break;
					case "LEFT":
						coord = `(${1*eTron.y - 1}, ${eTron.x})`;
						if (1*eTron.y - 1 >= 0 && !history.has(coord)) {
							console.log(`\x1b[32mJe peux aller en ${coord}\x1b[0m`);
							canMove = true;
						} else {
							console.log("\x1b[31mLa case est invalide, je change de direction.\x1b[0m");
							eTron.illegal = next;
						}
						break;
					case "RIGHT":
						coord = `(${1*eTron.y + 1}, ${eTron.x})`;
						if (1*eTron.y + 1 < gridSize[1] && !history.has(coord)) {
							console.log(`\x1b[32mJe peux aller en ${coord}\x1b[0m`);
							canMove = true;
						} else {
							console.log("\x1b[31mLa case est invalide, je change de direction.\x1b[0m");
							eTron.illegal = next;
						}
						break;
					default:
						console.log("\x1b[31mTanpijemeur\x1b[0m");
						return false;
				}
			} while (!canMove);

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
