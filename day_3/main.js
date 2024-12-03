window.onload = () => {
	fetch("input.txt")
		.then(result => result.text())
		.then(text => {
			const pattern = /mul\((\d{1,3}),(\d{1,3})\)/g

			const matches = [...text.matchAll(pattern)]

			let totalP1 = matches.reduce((p, c) => {
				const num0 = parseInt(c[1])
				const num1 = parseInt(c[2])
				return p + num0 * num1
			}, 0)

			console.log(totalP1)

			let totalP2 = 0

			let p2SegmentsDo = text.split("do()")
			p2SegmentsDo.forEach(seg => {
				let p2SegmentsDont = seg.split("don't()")
				if (!seg.startsWith("don't()")) {
					//don't()-statement directly following a do() statement means we can ignore this segment.

					const matches = [...p2SegmentsDont[0].matchAll(pattern)]

					totalP2 += matches.reduce((p, c) => {
						const num0 = parseInt(c[1])
						const num1 = parseInt(c[2])
						return p + num0 * num1
					}, 0)
				}
			})

			console.log(totalP2)
		})
}
