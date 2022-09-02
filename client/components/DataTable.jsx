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
          experiment={el.experimentName}
          context={JSON.stringify(el.context)}
          legacyResult={el.resultLegacy}
          microserviceResult={el.resultMS}
          legacyRuntime={el.legacyTime}
          microserviceRuntime={el.msTime}
          runtimeVariance={el.legacyTime - el.msTime}
          mismatch={el.mismatch}
          date={el.createdAt}
        />
      )
    })
  }
  const style = {
    wordWrap: 'break-word',
    maxWidth: '500px',
    maxHeight:'500px',
    overflow: 'scroll'
  }
  
  return (
  <div id="tabledata">
    <table className="table table-bordered table-dark">
      <thead>
        <tr align-middle="true" >
          <th>Experiment</th>
          <th>Context</th>
          <th>Legacy Result</th>
          <th>Microservice Result</th>  
          <th>Legacy Runtime (ms)</th>
          <th>Microservice Runtime (ms)</th>
          <th>Runtime Variance (ms)</th>
          <th>Mismatch</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {rows}
      </tbody>
    </table>
  </div>
  )
}
