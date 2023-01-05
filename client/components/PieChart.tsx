import { Pie } from 'react-chartjs-2'
import { ArcElement, Chart, Tooltip, Legend} from "chart.js"
import type { ChartData, ChartOptions } from 'chart.js';
import React from 'react'

Chart.register(ArcElement, Tooltip, Legend);

interface PieChartProps{
  id: string,
  data: ChartData<'pie'>,
  width: number,
  height: number,
  options: ChartOptions<'pie'>
}

const PieChart = ({ id, data, width, height, options }: PieChartProps) => {
  return (
  <>
    <Pie id={id} data={data} width = {width} height ={height} options={options}/>
  </>
)}

export default PieChart