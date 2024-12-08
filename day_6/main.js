let ct
let tileSize = 15
let loopMakers = new Set()
let grid
window.onload = () => {
	fetch("input.txt")
		.then(result => result.text())
		.then(text => {
			run(text)
		})
}
let dirs = [
	{ x: 0, y: -1 },
	{ x: 1, y: 0 },
	{ x: 0, y: 1 },
	{ x: -1, y: 0 },
]
function run(input) {
	let lines = input.split("\n")

	grid = lines.map(line => line.split(""))

	let startLine = grid.find(line => line.find(tile => tile == "^"))
	let curP = { x: startLine.indexOf("^"), y: grid.indexOf(startLine) }
	let curDir = dirs[0]

	console.time("run")
	let { placesVisited, loops } = findPath(curP, curDir, grid)
	console.timeEnd("run")

	console.log(placesVisited)
	console.log(loops)
}
function findPath(
	curP,
	curDir,
	addtionalObstacle = null,
	visited = new Set(),
	visitedDirs = new Set(),
	isLoopCheck = false,
) {
	let placesVisited = 1
	let loops = 0

	let isLoop = false
	while (isInBounds(curP, grid)) {
		const curDirHash = hash(curP, curDir)
		const curPHash = hash(curP)
		visited.add(curPHash)
		visitedDirs.add(curDirHash)
		let nextP = { x: curP.x + curDir.x, y: curP.y + curDir.y }
		const nextDirHash = hash(nextP, curDir)
		const nextPHash = hash(nextP)
		if (!isInBounds(nextP, grid)) {
			break //we left the grid
		} else {
			let nextTile =
				addtionalObstacle &&
				addtionalObstacle.x == nextP.x &&
				addtionalObstacle.y == nextP.y
					? "#"
					: grid[nextP.y][nextP.x]
			if (nextTile !== "#") {
				if (isLoopCheck && visitedDirs.has(nextDirHash)) {
					isLoop = true
					break
				}
				visitedDirs.add(curDirHash)

				if (!isLoopCheck && !visited.has(nextPHash)) {
					if (isInBounds({ x: nextP.x, y: nextP.y }, grid)) {
						if (
							findPath(
								{ ...curP },
								curDir,
								{ ...nextP },
								new Set(visited),
								new Set(visitedDirs),
								true,
							).isLoop
						) {
							if (!loopMakers.has(nextPHash)) {
								loops++
								loopMakers.add(nextPHash)
							}
						}
					}
				}
				curP = { ...nextP }

				if (!visited.has(nextPHash)) {
					placesVisited++
				}
			} else {
				curDir = dirs[(dirs.indexOf(curDir) + 1) % 4]
			}
		}
	}

	return { placesVisited, isLoop, loops }
}
function isInBounds(p, grid) {
	return p.x >= 0 && p.x < grid[0].length && p.y >= 0 && p.y < grid.length
}
function hash(obj0, obj1) {
	return obj0.x + "," + obj0.y + "." + (obj1 ? obj1.x + "," + obj1.y : "")
}
