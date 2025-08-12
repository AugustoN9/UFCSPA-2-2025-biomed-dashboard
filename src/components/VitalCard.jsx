import React from 'react'

function statusFor(type, value) {
  if (type === 'hr') {
    if (value < 50 || value > 120) return 'critical'
    if (value < 60 || value > 100) return 'warning'
    return 'normal'
  }
  if (type === 'spo2') {
    if (value < 85) return 'critical'
    if (value < 95) return 'warning'
    return 'normal'
  }
  if (type === 'temp') {
    if (value < 35 || value > 39) return 'critical'
    if (value < 36.1 || value > 37.2) return 'warning'
    return 'normal'
  }
  return 'normal'
}

export default function VitalCard({ label, value, unit, type }) {
  const status = statusFor(type, value)
  return (
    <div className={`vital-card ${status}`}>
      <div className="vital-label">{label}</div>
      <div className="vital-value">{value}{unit}</div>
    </div>
  )
}
