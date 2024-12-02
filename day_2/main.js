window.onload = () => {
	fetch("input.txt")
		.then(result => result.text())
		.then(text => {
			const lines = text
				.split("\n")
				.filter(line => line != "")
				.map(line => line.split(" ").map(spl => parseInt(spl)))

			//p1
			console.log(lines.reduce((p, c) => p + (isSafe(c) ? 1 : 0), 0))

			//p2
			console.log(lines.reduce((p, c) => p + (isAnySafe(c) ? 1 : 0), 0))
		})
}

function isSafe(arr) {
	let curNum = arr[0]
	let firstSign = Math.sign(arr[0] - arr[1])
	if (firstSign == 0) return false
	for (let i = 1; i < arr.length; i++) {
		if (Math.abs(arr[i] - curNum) > 3) {
			return false
		}
		if (i > 1 && Math.sign(arr[i - 1] - arr[i]) != firstSign) {
			return false
		}
		curNum = arr[i]
	}
	return true
}
function isAnySafe(arr) {
	for (let i = 0; i < arr.length; i++) {
		let copy = arr.slice()
		copy.splice(i, 1)
		if (isSafe(copy)) {
			return true
		}
	}
	return false
}
