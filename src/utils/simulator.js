export function startSimulator(onData, interval = 1000) {
    let hr = 75
    let spo2 = 98
    let temp = 36.6
  
    const id = setInterval(() => {
      hr += Math.round((Math.random() - 0.5) * 4)
      if (hr < 40) hr = 40
      if (hr > 140) hr = 140
  
      spo2 += (Math.random() - 0.5) * 0.5
      if (spo2 < 70) spo2 = 70
      if (spo2 > 100) spo2 = 100
      spo2 = Math.round(spo2 * 10) / 10
  
      temp += (Math.random() - 0.5) * 0.05
      temp = Math.round(temp * 10) / 10
  
      const reading = { hr, spo2, temp }
      onData(reading)
    }, interval)
  
    return id
  }
  
  export function stopSimulator(id) {
    if (!id) return
    clearInterval(id)
  }
  