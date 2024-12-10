let grid, ct
let step = 0
window.onload = () => {
	fetch("input.txt")
		.then(result => result.text())
		.then(text => {
			grid = text.split("\r\n").map(line =>
				line
					.split("")
					.filter(char => char)
					.map(char => ({ char: parseInt(char), score: null })),
			)

			// let cnv = document.createElement("canvas")
			// document.body.appendChild(cnv)
			// cnv.width = 1500
			// cnv.height = 1500
			// ct = cnv.getContext("2d")
			// let ts = 40
			// ct.font = "20px Arial black"
			// grid.forEach((row, i) => {
			// 	row.forEach((col, j) => {
			// 		ct.strokeRect(ts * j, ts * i, ts, ts)
			// 		ct.fillText(col.char, ts * j + ts * 0.35, ts * i + ts * 0.75)
			// 	})
			// })
			run()
		})
}
function run() {
	console.time("prep")
	startingPs = []
	for (let i = 0; i < grid.length; i++) {
		for (let j = 0; j < grid[0].length; j++) {
			if (grid[i][j].char == 0) {
				startingPs.push({ x: j, y: i })
			}
		}
	}
	console.timeEnd("prep")

	console.time("p1")
	let sumP1 = 0
	for (let i = 0; i < startingPs.length; i++) {
		sumP1 += doTileP1(startingPs[i].x, startingPs[i].y, new Set())
	}
	console.log(sumP1)
	console.timeEnd("p1")

	console.time("p2")
	let visited = new Set()
	let sumP2 = 0
	for (let i = 0; i < startingPs.length; i++) {
		// console.log(i, startingPs[i])
		sumP2 += doTile(startingPs[i].x, startingPs[i].y, visited)
	}
	console.log(sumP2)
	console.timeEnd("p2")
}

let directions = [
	{ x: -1, y: 0 },
	{ x: 1, y: 0 },
	{ x: 0, y: 1 },
	{ x: 0, y: -1 },
]
function doTile(x, y, visited = new Set()) {
	let tile = grid[y][x]
	const { score, char } = tile
	if (visited.has(hash({ x, y }))) {
		return score
	}
	if (char == 9) {
		grid[y][x].score = 1
		visited.add(hash({ x, y }))
		return 1
	}
	let sum = 0
	directions.forEach(dir => {
		let nextP = { x: x + dir.x, y: y + dir.y }
		if (isInBounds(nextP, grid)) {
			let next = grid[nextP.y][nextP.x]

			if (next.char == char + 1) {
				if (visited.has(hash(nextP))) {
					sum += next.score
				} else {
					sum += doTile(nextP.x, nextP.y, visited, 0)
				}
			}
		}
	})

	tile.score = sum + 0
	visited.add(hash({ x, y }))
	return sum
}
function doTileP1(x, y, visited) {
	let sum = 0
	visited.add(hash({ x, y }))

	if (grid[y][x].char == 9) {
		return 1
	}

	directions.forEach(dir => {
		let nextP = { x: x + dir.x, y: y + dir.y }
		if (isInBounds(nextP, grid)) {
			let next = grid[nextP.y][nextP.x]
			if (visited.has(hash(nextP))) {
				sum += next.score
			} else if (next.char == grid[y][x].char + 1) {
				sum += doTileP1(nextP.x, nextP.y, visited)
			}
		}
	})
	return sum
}
function isInBounds(p, grid) {
	return p.x >= 0 && p.x < grid[0].length && p.y >= 0 && p.y < grid.length
}
function hash(obj0, obj1) {
	return obj0.x + "," + obj0.y + "." + (obj1 ? obj1.x + "," + obj1.y : "")
}
