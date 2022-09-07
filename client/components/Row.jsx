import React from 'react';

export default function Row(props) {  return (
  <tr  >
    <td>{props.experiment}</td>
    <td>{props.context}</td>
    <td style= {{maxWidth:'200px'}}>{props.legacyResult}</td>
    <td style= {{maxWidth:'200px'}}>{props.microserviceResult}</td>
    <td>{props.legacyRuntime}</td>
    <td>{props.microserviceRuntime}</td>
    <td>{props.runtimeVariance}</td>
    <td>{`${props.mismatch}`}</td>  
    <td style= {{maxWidth:'100px'}}>{props.date}</td>
  </tr>
);
}