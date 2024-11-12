import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register the necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MetricsChart = ({ data, title }) => {
  const chartData = {
    labels: data.timestamps, // Assumes timestamps are passed in props
    datasets: [
      {
        label: title,
        data: data.values, // Assumes metric values are passed in props
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        type: 'category', // Explicitly set x-axis type to 'category'
        title: { display: true, text: 'Time' },
      },
      y: {
        title: { display: true, text: 'Metric Value' },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default MetricsChart;