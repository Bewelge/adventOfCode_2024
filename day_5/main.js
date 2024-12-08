window.onload = () => {
	fetch("input.txt")
		.then(result => result.text())
		.then(text => {
			run(text)
		})
}
function run(input) {
	let ruleLines = input.split("\n\n")[0].split("\n")
	let printLines = input.split("\n\n")[1].split("\n")
	let rules = {}
	ruleLines.forEach(line => {
		const [a, b] = line.split("|")
		if (!rules.hasOwnProperty(a)) {
			rules[a] = []
		}
		rules[a].push(b)
	})

	let correctUpdatesSum = 0
	let swaps = 0
	let incorrectUpdatesSum = 0
	printLines.forEach(line => {
		let nums = line.split(",")

		if (isSeqCorrect(nums, rules)) {
			correctUpdatesSum += parseInt(nums[Math.floor(nums.length / 2)])
		} else {
			let newSeq = nums.slice()

			while (!isSeqCorrect(newSeq, rules)) {
				forloop: for (let i = 0; i < newSeq.length; i++) {
					const num = newSeq[i]
					if (rules[num]) {
						let incorrectNum = rules[num].find(
							followingNum => newSeq.slice(0, i).indexOf(followingNum) > -1,
						)
						if (incorrectNum) {
							let tmp = newSeq[i]
							swaps++
							newSeq[i] = newSeq[newSeq.indexOf(incorrectNum)]
							newSeq[newSeq.indexOf(incorrectNum)] = tmp
							break forloop
						}
					}
				}
			}
			incorrectUpdatesSum += parseInt(newSeq[Math.floor(newSeq.length / 2)])
		}
	})
	console.log(swaps)
	console.log(correctUpdatesSum)
	console.log(incorrectUpdatesSum)
}
function isSeqCorrect(nums, rules) {
	let isAnyWrong = false
	nums.forEach((num, i) => {
		if (rules[num]) {
			if (
				rules[num].find(
					followingNum => nums.slice(0, i).indexOf(followingNum) > -1,
				)
			) {
				isAnyWrong = true
			}
		}
	})
	return !isAnyWrong
}
