import React from 'react';
import DataTable from '../components/DataTable';
// Should we attempt to receive zipped files and decompress?
// for raw data, maybe!



const App = () => {
  const [experiments, setExperiments] = useState('-- Loading Experiments --');
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
      })
      .catch((err) => {
        console.log('error in fetching experiments');
        console.log(err);
      })
  }

  /* Uncomment when middleware is working 
  useEffect(() => {getExperiments()}, []);
  */

  // When the user selects an experiment, we want to go grab the data
  useEffect(() => {
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
  }, [currExperiment]);

  return (
    <>
      <h1>Ekho Comparison Data</h1>
      {/* <DataTable data={rawMismatchData}/> */}
    </>
  )

  // okay, we need to now structure the page. 
  // To start, basically a hello world table

  // Keep it ultra-simple for now: literally a sidebar that represents 2 or 3 or 4 units of the grid
}