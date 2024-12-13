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
}

let machines

window.onload = () => {
	fetch("input.txt")
		.then(result => result.text())
		.then(text => {
			machines = text.split("\r\n\r\n").map(machine => {
				const [butA, butB, target] = machine.split("\r\n")
				let butAX = parseInt(butA.split("X+")[1].split(", Y")[0])
				let butAY = parseInt(butA.split("Y+")[1])
				let butBX = parseInt(butB.split("X+")[1].split(", Y")[0])
				let butBY = parseInt(butB.split("Y+")[1])
				let targetX = parseInt(target.split("X=")[1].split(", Y")[0])
				let targetY = parseInt(target.split("Y=")[1])
				return {
					a: new Vector(butAX, butAY),
					b: new Vector(butBX, butBY),
					target: new Vector(targetX, targetY),
				}
			})
			run()
		})
}
function run() {
	let totalCost = 0
	console.time("p0")
	machines.forEach(machine => {
		const { a, b, target } = machine

		let p = new Vector(0, 0)

		for (let i = 0; i < 100; i++) {
			if (
				(target.x - p.x) % b.x == 0 &&
				(target.y - p.y) % b.y == 0 &&
				(target.x - p.x) / b.x == (target.y - p.y) / b.y
			) {
				totalCost += i * 3 + (target.x - p.x) / b.x
				break
			}

			p.add(a)
		}
	})
	console.log(totalCost)
	console.timeEnd("p0")

	console.time("p1")
	let totalCostP1 = 0
	machines.forEach(machine => {
		let { target, a, b } = machine
		target.add(new Vector(10000000000000, 10000000000000))

		let i = (target.y * b.x - target.x * b.y) / (a.y * b.x - a.x * b.y)
		let j = (target.y * a.x - target.x * a.y) / (b.y * a.x - b.x * a.y)

		if (i % 1 == 0 && j % 1 == 0) {
			totalCostP1 += i * 3 + j
		}
	})
	console.timeEnd("p1")
	console.log(totalCostP1)
}
