import { Pie } from 'react-chartjs-2'
import { ArcElement, Chart, Tooltip, Legend} from "chart.js"
import React from 'react'

Chart.register(ArcElement, Tooltip, Legend);

export default function PieChart (props) {
  const { id, data, width, height, options } = props
  return (
  <>
    <Pie id={id} data={data} width = {width} height ={height} options={options}/>
  </>
)}