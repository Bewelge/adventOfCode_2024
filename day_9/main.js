window.onload = () => {
	fetch("input.txt")
		.then(result => result.text())
		.then(text => run(text))
}

function run(input) {
	let blocks = []
	let data = input.split("")
	for (let i = 0; i < data.length; i += 2) {
		let size = parseInt(data[i])
		let freeSpace = parseInt(data[i + 1]) || 0
		let id = Math.floor(i / 2)
		blocks.push({ size, freeSpace, id })
	}

	console.time("p1")
	p1(blocks.slice().map(block => ({ ...block })))
	console.timeEnd("p1")

	console.time("p2")
	p2(blocks)
	console.timeEnd("p2")
}

function p1(blocks) {
	let curPosition = 0
	let checkSum = 0

	for (let i = 0; i < blocks.length; i++) {
		let block = blocks[i]
		const { size, id, freeSpace } = block
		for (let j = 0; j < size; j++) {
			checkSum += id * curPosition
			curPosition++
		}
		for (let j = 0; j < freeSpace && i != blocks.length - 1; j++) {
			let last = blocks[blocks.length - 1]
			checkSum += last.id * curPosition
			last.size--
			curPosition++
			if (last.size == 0) {
				blocks.splice(blocks.length - 1, 1)
				last = blocks[blocks.length - 1]
			}
		}
	}

	console.log(checkSum)
	return { checkSum, curPosition }
}
function p2(blocks) {
	let curPosition = 0
	let checkSum = 0
	for (let i = 0; i < blocks.length; i++) {
		let block = blocks[i]
		if (block.prepend) {
			curPosition += block.prepend
		}
		const { size, id, freeSpace } = block
		for (let j = 0; j < size; j++) {
			checkSum += id * curPosition
			curPosition++
		}

		let foundAny = true
		whileLoop: while (block.freeSpace > 0 && foundAny) {
			foundAny = false
			forLoop: for (let j = blocks.length - 1; j > i; j--) {
				if (blocks[j].size > 0 && blocks[j].size <= block.freeSpace) {
					foundAny = true
					for (let k = 0; k < blocks[j].size; k++) {
						checkSum += curPosition * blocks[j].id
						curPosition++
					}
					block.freeSpace -= blocks[j].size
					blocks[j].prepend = blocks[j].size
					blocks[j].size = 0
					break forLoop
				}
			}
		}

		curPosition += block.freeSpace
	}
	console.log(checkSum)
}
