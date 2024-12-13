let grid, ct
let step = 0
let cache = {}
window.onload = () => {
	fetch("input.txt")
		.then(result => result.text())
		.then(text => run(text))
}
function run(input) {
	let stones = input.split(" ").map(s => parseInt(s))

	console.time("p1")
	let sumP1 = 0
	stones.forEach(num => {
		sumP1 += getCount(num, 25)
	})
	console.log(sumP1)
	console.timeEnd("p1")

	console.time("p2")
	let sumP2 = 0
	stones.forEach(num => {
		sumP2 += getCount(num, 75)
	})
	console.log(sumP2)
	console.timeEnd("p2")
}

function getCount(num, iterations) {
	if (iterations == 0) return 1

	if (cache.hasOwnProperty(hash(num, iterations))) {
		return cache[hash(num, iterations)]
	}

	let count = 0
	if (num == 0) {
		return getCount(1, iterations - 1)
	} else if (("" + num).length % 2 == 0) {
		let str = "" + num
		let half0 = str.slice(0, str.length / 2)
		let half1 = str.slice(str.length / 2)

		count +=
			getCount(parseInt(half0), iterations - 1) +
			getCount(parseInt(half1), iterations - 1)
	} else {
		count += getCount(num * 2024, iterations - 1)
	}

	cache[hash(num, iterations)] = count
	return count
}

function hash(obj0, obj1) {
	return obj0 + "," + obj1
}
