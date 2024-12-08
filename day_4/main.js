let grid
let order = "XMAS".split("")
const directions = [
	{ x: 1, y: 0 },
	{ x: -1, y: 0 },
	{ x: 0, y: 1 },
	{ x: 0, y: -1 },
	{ x: 1, y: 1 },
	{ x: 1, y: -1 },
	{ x: -1, y: 1 },
	{ x: -1, y: -1 },
]

window.onload = () => {
	fetch("input.txt")
		.then(result => result.text())
		.then(text => {
			run(text)
		})
}
function run(input) {
	const lines = input.split("\n")
	grid = lines.map(line => line.split(""))

	//p1
	let amount = 0
	for (let i = 0; i < grid.length; i++) {
		for (let j = 0; j < grid[0].length; j++) {
			if (grid[i][j] == order[0]) {
				directions.forEach(dir => {
					if (find(1, j + dir.x, i + dir.y, dir)) {
						amount++
					}
				})
			}
		}
	}
	console.log(amount)

	//p2
	let amount2 = 0
	for (let i = 0; i < grid.length; i++) {
		for (let j = 0; j < grid[0].length; j++) {
			if (grid[i][j] == "A") {
				if (checkX(j, i)) {
					amount2++
				}
			}
		}
	}
	console.log(amount2)
}

function find(index, x, y, dir) {
	try {
		if (grid[y][x] == order[index]) {
			index++
			return index == order.length
				? true
				: find(index, x + dir.x, y + dir.y, dir)
		}
	} catch (e) {
		// lazy out of bounds check.
	}
	return false
}

function checkX(x, y) {
	let leftDirs = [
		{ x: 1, y: 1 },
		{ x: -1, y: -1 },
	]
	let rightDirs = [
		{ x: 1, y: -1 },
		{ x: -1, y: 1 },
	]
	return isMAndS(x, y, leftDirs) && isMAndS(x, y, rightDirs)
}

function isMAndS(x, y, dirs) {
	try {
		let p0 = grid[y + dirs[0].y][x + dirs[0].x]
		let p1 = grid[y + dirs[1].y][x + dirs[1].x]
		return (p0 == "S" && p1 == "M") || (p1 == "S" && p0 == "M")
	} catch (e) {
		// lazy out of bounds check.
	}
	return false
}
