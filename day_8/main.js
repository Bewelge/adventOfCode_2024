let ct
let tileSize = 15
let loopMakers = {}

window.onload = () => {
	fetch("input.txt")
		.then(result => result.text())
		.then(text => run(text))
}

function run(input) {
	const lines = input.split("\n")
	const grid = lines.map(line => line.split(""))

	let nodeMap = {}
	grid.forEach((row, i) => {
		row.forEach((tile, j) => {
			if (tile != ".") {
				if (!nodeMap.hasOwnProperty(tile)) {
					nodeMap[tile] = []
				}
				nodeMap[tile].push({ x: j, y: i })
			}
		})
	})

	console.time("p1")
	p1(nodeMap, grid)
	console.timeEnd("p1")

	console.time("p2")
	p2(nodeMap, grid)
	console.timeEnd("p2")
}

function p1(nodeMap, grid) {
	let antiNodes = new Set()
	Object.keys(nodeMap).forEach(nodesKey => {
		const nodes = nodeMap[nodesKey]
		nodes.forEach((node0, i) => {
			nodes.forEach((node1, j) => {
				if (i !== j) {
					let xDif = node0.x - node1.x
					let yDif = node0.y - node1.y
					let anP0 = { x: node0.x + xDif, y: node0.y + yDif }
					let anP1 = { x: node1.x - xDif, y: node1.y - yDif }

					if (isInBounds(anP0, grid) && !antiNodes.has(hash(anP0))) {
						antiNodes.add(hash(anP0))
					}
					if (isInBounds(anP1, grid) && !antiNodes.has(hash(anP1))) {
						antiNodes.add(hash(anP1))
					}
				}
			})
		})
	})
	console.log(antiNodes.size)
}
function p2(nodeMap, grid) {
	const antiNodes2 = new Set()
	Object.keys(nodeMap).forEach(nodesKey => {
		const nodes = nodeMap[nodesKey]
		nodes.forEach((node0, i) => {
			nodes.forEach((node1, j) => {
				if (i !== j) {
					let xDif = node0.x - node1.x
					let yDif = node0.y - node1.y
					let anP0 = { x: node0.x + xDif, y: node0.y + yDif }
					let anP1 = { x: node1.x - xDif, y: node1.y - yDif }

					if (!antiNodes2.has(hash(node0))) {
						antiNodes2.add(hash(node0))
					}
					if (!antiNodes2.has(hash(node1))) {
						antiNodes2.add(hash(node1))
					}

					while (isInBounds(anP0, grid)) {
						if (isInBounds(anP0, grid) && !antiNodes2.has(hash(anP0))) {
							antiNodes2.add(hash(anP0))
						}
						anP0.x += xDif
						anP0.y += yDif
					}
					while (isInBounds(anP1, grid)) {
						if (isInBounds(anP1, grid) && !antiNodes2.has(hash(anP1))) {
							antiNodes2.add(hash(anP1))
						}
						anP1.x -= xDif
						anP1.y -= yDif
					}
				}
			})
		})
	})
	console.log(antiNodes2.size)
}

function isInBounds(p, grid) {
	return p.x >= 0 && p.x < grid[0].length && p.y >= 0 && p.y < grid.length
}
function hash(obj0, obj1) {
	return obj0.x + "," + obj0.y + "." + (obj1 ? obj1.x + "," + obj1.y : "")
}
