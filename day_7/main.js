let ct
let tileSize = 15
let loopMakers = {}

window.onload = () => {
	let cnv = document.createElement("canvas")
	document.body.appendChild(cnv)
	cnv.width = 1500
	cnv.height = 1500
	ct = cnv.getContext("2d")
	ct.font = tileSize + "px Arial black"
	fetch("input.txt")
		.then(result => result.text())
		.then(text => run(text))
}
let dirs = [
	{ x: 0, y: -1 },
	{ x: 1, y: 0 },
	{ x: 0, y: 1 },
	{ x: -1, y: 0 },
]
function run(input) {
	const lines = input
		.split("\n")
		.map(line => line.split(":"))
		.map(([testV, rest]) => ({
			testV: parseInt(testV),
			values: rest
				.split(" ")
				.filter(a => a.trim())
				.map(a => parseInt(a)),
		}))
	// console.log(lines)

	// let totalP0 = 0
	// lines.forEach(line => {
	// 	const { testV, values } = line

	// 	if (checkFunction(testV, values)) {
	// 		totalP0 += testV
	// 	}
	// })
	// console.log(totalP0)

	let totalP1 = 0
	lines.forEach(line => {
		const { testV, values } = line

		if (checkFunctionP1(testV, values)) {
			totalP1 += testV
		}
	})
	console.log(totalP1)
	// const [testV,rest] =
}

function checkFunction(testV, values) {
	let ops = [mult, add]
	let tmpVs = [values[0]]

	for (let i = 1; i < values.length; i++) {
		let prevTmps = tmpVs.slice()
		tmpVs = []
		ops.forEach(op => {
			prevTmps.forEach(v => {
				tmpVs.push(op(v, values[i]))
			})
		})
	}
	return tmpVs.includes(testV)
}
function checkFunctionP1(testV, values) {
	let ops = [mult, add, concatNums]
	let tmpVs = [values[0]]

	for (let i = 1; i < values.length; i++) {
		let prevTmps = tmpVs.slice()
		tmpVs = []
		ops.forEach(op => {
			prevTmps.forEach(v => {
				tmpVs.push(op(v, values[i]))
			})
		})
	}
	return tmpVs.includes(testV)
}
function mult(a, b) {
	return a * b
}
function add(a, b) {
	return a + b
}
function concatNums(a, b) {
	return parseInt(a + "" + b)
}
