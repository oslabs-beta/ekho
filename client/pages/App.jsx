import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import '../stylesheets/style.scss';
// Should we attempt to receive zipped files and decompress?
// for raw data, maybe!



const App = () => {
  const [experiments, setExperiments] = useState(['-- Loading Experiments --']);
  const [currExperiment, setCurrExperiment] = useState('-- Loading Experiments --');
  const [context, setContext] = useState('');
  const [rawMismatchData, setRawMismatchData] = useState('');

  // On document load, we want to go grab unique experiments
  const getExperiments = () => {
    fetch('http://localhost:443/experiments')
      .then(res => res.json())
      .then(experiments => {
        console.log('got experiments');
        console.log(experiments);
        setExperiments(experiments);
        setCurrExperiment(experiments[0])
      })
      .catch((err) => {
        console.log('error in fetching experiments');
        console.log(err);
      })
  }

  /* Uncomment when middleware is working 
  */
  useEffect(() => {getExperiments()}, []);

  // When the user selects an experiment, we want to go grab the data
  useEffect(() => {
    if (currExperiment !== '-- Loading Experiments --') {
      console.log('experiment has changed, fetching data');
      // TODO: finalize the roue
      fetch(`http://localhost:8080/experiment/data/?experimentName=${currExperiment}`)
        .then(res => res.json())
        .then(data => {
          console.log('data from experiment');
          console.log(data);
          // We're getting at least a couple types of data here
          // - Raw mismatch data, rolled up data, and context for the experiment
          // - unless we want all the data aggregation to be done client-side.
          setRawMismatchData(data);
        })
        .catch(err => {
          console.log(`error in fetching experiment data for ${currExperiment}`);
          console.log(err);
        });
    }
  }, [currExperiment]);

  const experimentsDropdown = [];

  for (let i = 0; i < experiments.length; i++) {
    experimentsDropdown.push(<option key={`experiment${i}`} value={experiments[i]}>{experiments[i]}</option>);
  }

  return (
    <>
      <h1>Ekho Comparison Data</h1>
      <div className='body'>
        <div className='dropdown-body'>
          <h4>Experiment</h4>
          <select id= "selectExperiment" onChange = {(e) => {setCurrExperiment(e.target.value);}}>
            {experimentsDropdown}
          </select>
        </div>
      <DataTable data={rawMismatchData}/>
      </div>
    </>
  )
}

export default App