import React from 'react';

export default function Row(props) {  return (
  <tr>
    <td>{props.experiment}</td>
    <td>{props.context}</td>
    <td>{props.legacyResult}</td>
    <td>{props.microserviceResult}</td>
    <td>{props.legacyRuntime}</td>
    <td>{props.microserviceRuntime}</td>
    <td>{props.runtimeVariance}</td>
    <td>{`${props.mismatch}`}</td>
    <td>{props.date}</td>
  </tr>
);
}