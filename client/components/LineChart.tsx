import React from 'react';
import { Line } from 'react-chartjs-2';
import "../stylesheets/style.scss";

import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import type { ChartData, ChartOptions} from 'chart.js'
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

//PROGRESSIVE
// const config = {
//   type: 'line',
//   data: {
//     datasets: [{
//       borderColor: Utils.CHART_COLORS.red,
//       borderWidth: 1,
//       radius: 0,
//       data: data,
//     },
//     {
//       borderColor: Utils.CHART_COLORS.blue,
//       borderWidth: 1,
//       radius: 0,
//       data: data2,
//     }]
//   },
//   options: {
//     animation,
//     interaction: {
//       intersect: false
//     },
//     plugins: {
//       legend: false
//     },
//     scales: {
//       x: {
//         type: 'linear'
//       }
//     }
//   }
// };

interface LineChartProps{
  options: ChartOptions<'line'>
  data: ChartData<'line'>
}

const LineChart = ({ options, data }: LineChartProps) => {
  console.log(options)
  return(
  <>
      <Line id="lineChart" options={options} data={data} width={100} height={100}/>
  </>
)}

export default LineChart