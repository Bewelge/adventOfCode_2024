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
let gridW = 101
let gridH = 103
let robots
let ts = 10

window.onload = () => {
	fetch("input.txt")
		.then(result => result.text())
		.then(text => {
			let cnv = document.createElement("canvas")
			document.body.appendChild(cnv)
			cnv.width = 1500
			cnv.height = 1500
			ct = cnv.getContext("2d")
			ct.font = "20px Arial black"

			//used input to find two cycles  ==> 30 + 103 + x and  81 + 101 * x
			//First convergence of these two cycles (x = 76) was the picture.
			let inp = document.createElement("input")
			inp.type = "range"
			inp.value = 0
			inp.min = 0
			inp.max = 1000
			inp.step = 1
			document.body.appendChild(inp)
			inp.style.width = "100%"

			inp.addEventListener("input", () => {
				let robCopy = robots
					.slice()
					.map(rb => ({ p: rb.p.clone(), v: rb.v.clone() }))
				console.log(inp.value)
				for (let i = 0; i < 81 + 101 * parseInt(inp.value); i++) {
					simulateRound(robCopy)
				}

				renderGrid(robCopy)
			})

			robots = text.split("\r\n").map(line => {
				const [pStr, vStr] = line.split(" ")
				let px = parseInt(pStr.split("p=")[1].split(",")[0])
				let py = parseInt(pStr.split(",")[1])
				let vx = parseInt(vStr.split("v=")[1].split(",")[0])
				let vy = parseInt(vStr.split(",")[1])

				return {
					p: new Vector(px, py),
					v: new Vector(vx, vy),
				}
			})
			run()
		})
}
function run() {
	let quadrants = [
		[
			new Vector(0, 0),
			new Vector(Math.floor(gridW / 2), Math.floor(gridH / 2)),
		],
		[
			new Vector(Math.ceil(gridW / 2), 0),
			new Vector(gridW, Math.floor(gridH / 2)),
		],
		[
			new Vector(0, Math.ceil(gridH / 2)),
			new Vector(Math.floor(gridW / 2), gridH),
		],
		[
			new Vector(Math.ceil(gridW / 2), Math.ceil(gridH / 2)),
			new Vector(gridW, gridH),
		],
	]

	let robCopy = robots.slice().map(rb => ({ p: rb.p.clone(), v: rb.v.clone() }))
	for (let i = 0; i < 100; i++) {
		simulateRound(robCopy)
	}

	let results = []
	quadrants.forEach(qd => {
		let sum = robCopy.reduce(
			(p, rob) => p + (isInQuadrant(rob.p, qd) ? 1 : 0),
			0,
		)
		results.push(sum)
	})

	console.log(results.reduce((p, c) => p * c, 1))
}

function simulateRound(rbs) {
	rbs.forEach(robot => {
		robot.p.add(robot.v)
		while (robot.p.x < 0) {
			robot.p.x += gridW
		}
		while (robot.p.y < 0) {
			robot.p.y += gridH
		}
		robot.p.x = robot.p.x % gridW
		robot.p.y = robot.p.y % gridH
	})
}

function renderGrid(rbs) {
	ct.clearRect(0, 0, 1500, 1500)
	rbs.forEach(rb => {
		ct.fillRect(rb.p.x * ts, rb.p.y * ts, ts, ts)
	})
}

function isInQuadrant(p, quadrant) {
	return (
		p.x >= quadrant[0].x &&
		p.x < quadrant[1].x &&
		p.y >= quadrant[0].y &&
		p.y < quadrant[1].y
	)
}
