import React from 'react';

export interface RowProps {
  experiment: string
  context: string
  legacyResult: string
  microserviceResult: string
  legacyRuntime: number
  microserviceRuntime: number
  runtimeVariance: number
  mismatch: boolean
  date: Date
}

const Row = ({ experiment, context, legacyResult, microserviceResult, legacyRuntime, microserviceRuntime, runtimeVariance, mismatch, date }: RowProps) => {  
  return (
    <tr  >
      <td>{experiment}</td>
      <td>{context}</td>
      <td style= {{maxWidth:'200px'}}>{legacyResult}</td>
      <td style= {{maxWidth:'200px'}}>{microserviceResult}</td>
      <td>{legacyRuntime}</td>
      <td>{microserviceRuntime}</td>
      <td>{runtimeVariance}</td>
      <td>{`${mismatch}`}</td>  
      <td style= {{maxWidth:'100px'}}>{date}</td>
    </tr>
  );
}

export default Row