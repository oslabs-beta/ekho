import React from 'react';
import Row from './Row.jsx';

export default function DataTable(props) {
  const rows = [];
  const data = props.data;
  if (data) {
    data.forEach((el, idx) => {
      rows.push(
        <Row 
          key={`row${idx}`}
          experiment={el.experiment}
          context={json.stringify(el.context)}
          legacyResult={el.legacyResult}
          microserviceResult={el.microserviceResult}
          legacyRuntime={el.legacyRuntime}
          microserviceRuntime={el.microserviceRuntime}
          runtimeVariance={el.legacyRuntime - el.microserviceRuntime}
          mismatch={el.mismatch}
        />
      )
    })
  }
  return (
  <table className="table table-bordered table-dark">
    <thead>
      <tr align-middle="true" >
        <th>Experiment</th>
        <th>Context</th>
        <th>Legacy Result</th>
        <th>Microservice Result</th>
        <th>Legacy Runtime</th>
        <th>Microservice Runtime</th>
        <th>Runtime Variance</th>
        <th>Mismatch</th>
      </tr>
    </thead>
    <tbody>
      {rows}
    </tbody>
  </table>
  )
}
