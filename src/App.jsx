import React, { useEffect, useState, useRef } from 'react'
import VitalCard from './components/VitalCard'
import LiveChart from './components/LiveChart'
import { startSimulator, stopSimulator } from './utils/simulator'
import { io } from 'socket.io-client'

const DEFAULT_WS = 'http://localhost:3001'

export default function App() {
  const [data, setData] = useState({ hr: 75, spo2: 98, temp: 36.6 })
  const [history, setHistory] = useState([])
  const [connected, setConnected] = useState(false)
  const socketRef = useRef(null)
  const simRef = useRef(null)

  function handleNew(reading) {
    setData(reading)
    setHistory(prev => {
      const next = [...prev, { ...reading, ts: Date.now() }]
      return next.slice(-60)
    })
  }

  useEffect(() => {
    // start local simulator by default
    simRef.current = startSimulator(handleNew, 1000)
    return () => {
      stopSimulator(simRef.current)
      if (socketRef.current) socketRef.current.disconnect()
    }
  }, [])

  const connectSocket = (url = DEFAULT_WS) => {
    if (socketRef.current) socketRef.current.disconnect()
    try {
      const socket = io(url)
      socketRef.current = socket
      socket.on('connect', () => {
        setConnected(true)
        if (simRef.current) { stopSimulator(simRef.current); simRef.current = null }
      })
      socket.on('disconnect', () => setConnected(false))
      socket.on('reading', (r) => handleNew(r))
      socket.on('data', (r) => handleNew(r))
      socket.on('connect_error', (err) => {
        console.error('connect_error', err)
        alert('Erro de conexão: ' + (err.message || err))
      })
    } catch (err) {
      console.error('socket error', err)
      alert('Falha ao conectar: ' + err.message)
    }
  }

  const disconnectSocket = () => {
    if (socketRef.current) socketRef.current.disconnect()
    socketRef.current = null
    setConnected(false)
    if (!simRef.current) simRef.current = startSimulator(handleNew, 1000)
  }

  return (
    <div className="app">
      <header>
        <h1>Dashboard Biomédico — Monitoramento em Tempo Real</h1>
        <div className="controls">
          <input id="wsUrl" defaultValue={DEFAULT_WS} placeholder="ws URL (ex: http://localhost:3001)" />
          {!connected ? (
            <button onClick={() => connectSocket(document.getElementById('wsUrl').value)}>Conectar ao backend</button>
          ) : (
            <button onClick={disconnectSocket}>Desconectar</button>
          )}
          <button onClick={() => { setHistory([]) }}>Limpar histórico</button>
        </div>
      </header>

      <main>
        <section className="vitals">
          <VitalCard label="Batimentos" value={data.hr} unit=" bpm" type="hr"/>
          <VitalCard label="Saturação (SpO₂)" value={data.spo2} unit=" %" type="spo2"/>
          <VitalCard label="Temperatura" value={data.temp} unit=" °C" type="temp"/>
        </section>

        <section className="charts">
          <LiveChart history={history} />
        </section>
      </main>

      <footer>
        <small>Simulação local ativa quando não há conexão com backend. Use um servidor Socket.IO emitindo evento 'reading' ou 'data' com {"{ hr, spo2, temp }"}</small>
      </footer>
    </div>
  )
}
