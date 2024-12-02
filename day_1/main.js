window.onload = () => {
  fetch("input.txt")
    .then((result) => result.text())
    .then((text) => {
      const lines = text.split("\n").filter((line) => line != "")
      console.log(lines)
      let l0 = lines.map(line => parseInt(line.split("   ")[0])).sort()
      let l1 = lines.map(line => parseInt(line.split("   ")[1])).sort()

      let totDis = l0.reduce((p,c,i) => p + Math.abs(c - l1[i]),0)
      console.log(totDis)

      let occurences = {}
      l1.forEach(num => {
        if (!occurences.hasOwnProperty(num)) {
          occurences[num] = 0
        }
        occurences[num]++
      })
      let simScore = l0.reduce((p,c,i) => {
        return p + c * (occurences[c] || 0)
      },0)
      console.log(simScore)
      
    })
}

