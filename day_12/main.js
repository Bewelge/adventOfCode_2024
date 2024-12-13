class Vector {
	constructor(x, y) {
		this.x = x
		this.y = y
	}

	add(vec) {
		this.x += vec.x
		this.y += vec.y
		return this
	}
	clone() {
		return new Vector(this.x, this.y)
	}
}

let grid
const cache = new Set()
const regionCaches = []
const dirs = [
	new Vector(0, -1),
	new Vector(1, 0),
	new Vector(0, 1),
	new Vector(-1, 0),
]

window.onload = () => {
	fetch("input.txt")
		.then(result => result.text())
		.then(text => {
			grid = text.split("\r\n").map(line => line.split("").filter(char => char))
			run()
		})
}
function run() {
	let regions = []

	console.time("findRegions")
	for (let i = 0; i < grid.length; i++) {
		for (let j = 0; j < grid[0].length; j++) {
			const startP = new Vector(j, i)
			const _pHash = pHash(startP)
			if (!cache.has(_pHash)) {
				cache.add(_pHash)
				const region = [startP]

				regions.push(region)
				const regionCache = new Set()
				regionCache.add(_pHash)
				regionCaches.push(regionCache)

				dirs.forEach(dir => {
					const nextP = startP.clone().add(dir)
					if (isInBounds(nextP, grid)) {
						checkNext(nextP, grid[i][j], region, regionCache)
					}
				})
			}
		}
	}

	console.timeEnd("findRegions")

	console.time("p0")
	let sumP0 = 0
	regions.forEach((region, i) => {
		let peri0 = 0
		region.forEach(tile =>
			dirs.forEach(dir => {
				const nextP = tile.clone().add(dir)
				if (!regionCaches[i].has(pHash(nextP))) {
					peri0++
				}
			}),
		)
		sumP0 += peri0 * region.length
	})
	console.log(sumP0)
	console.timeEnd("p0")

	console.time("p1")
	let sumP1 = 0
	regions.forEach((region, i) => {
		let dirMemo = new Set()
		const dirHash = (p, dir) => {
			return p.x + "," + p.y + "," + dir.x + "," + dir.y
		}

		let sides = 0
		region.forEach(tile =>
			dirs.forEach(dir => {
				if (!dirMemo.has(dirHash(tile, dir))) {
					const nextP = tile.clone().add(dir)
					if (!isInBounds(nextP, grid) || !isInRegion(nextP, i)) {
						sides++
						dirMemo.add(dirHash(tile, dir))

						const perpendicularDirections = [
							dirs[(dirs.indexOf(dir) + 1) % 4],
							dirs[(dirs.indexOf(dir) + 3) % 4],
						]
						perpendicularDirections.forEach(perpDir => {
							let tileOfGrid = tile.clone().add(perpDir)
							let tileOutside = tileOfGrid.clone().add(dir)
							while (true) {
								if (
									!dirMemo.has(dirHash(tileOfGrid, dir)) &&
									isInBounds(tileOfGrid, grid) &&
									isInRegion(tileOfGrid, i) &&
									!isInRegion(tileOutside, i)
								) {
									dirMemo.add(dirHash(tileOfGrid, dir))
								} else {
									break
								}
								tileOfGrid.add(perpDir)
								tileOutside.add(perpDir)
							}
						})
					}
				}
			}),
		)
		sumP1 += sides * region.length
	})
	console.log(sumP1)

	console.timeEnd("p1")
}
function isInRegion(p, regionCacheIndex) {
	return regionCaches[regionCacheIndex].has(pHash(p))
}

function checkNext(p, char, region, regionCache) {
	const { x, y } = p
	const _hash = pHash(p)
	if (!cache.has(_hash) && grid[y][x] == char) {
		cache.add(_hash)
		region.push(p)
		regionCache.add(_hash)

		dirs.forEach(dir => {
			const nextP = p.clone().add(dir)
			if (isInBounds(nextP, grid)) {
				checkNext(nextP, char, region, regionCache)
			}
		})
	}
}
function isInBounds(p, grid) {
	return p.x >= 0 && p.x < grid[0].length && p.y >= 0 && p.y < grid.length
}
function pHash(p) {
	return p.x + "," + p.y
}
