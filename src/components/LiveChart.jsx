import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";

// Registrando módulos obrigatórios
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Função para simular dados biomédicos (batimento cardíaco)
function generateHeartRate() {
  return Math.floor(Math.random() * (100 - 60 + 1)) + 60; // 60-100 bpm
}

export default function LiveChart() {
  const [labels, setLabels] = useState([]);
  const [values, setValues] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeLabel = now.toLocaleTimeString();

      setLabels((prev) => [...prev.slice(-9), timeLabel]); // Mantém só últimos 10 pontos
      setValues((prev) => [...prev.slice(-9), generateHeartRate()]);
    }, 1000); // atualiza a cada 1s

    return () => clearInterval(interval);
  }, []);

  const data = {
    labels,
    datasets: [
      {
        label: "Batimento Cardíaco (bpm)",
        data: values,
        borderColor: "rgb(250, 250, 51)", // Cor da linha
        backgroundColor: "rgb(250, 250, 51)", // Cor do preenchimento
        tension: 0.3 // deixa a linha mais suave
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top"
      },
      title: {
        display: true,
        text: "Monitor de Batimento Cardíaco"
      }
    },
    scales: {
      y: {
        suggestedMin: 50,
        suggestedMax: 110
      }
    }
  };

  return <Line data={data} options={options} />;
}
