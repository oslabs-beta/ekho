import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import '../stylesheets/style.scss';
import PieChart from '../components/PieChart.jsx'

import LineChart from '../components/LineChart.jsx'
import DownloadCSV from '../components/downloadCSVbutton'

import { Dropdown, ToggleButton } from 'react-bootstrap'

// Should we attempt to receive zipped files and decompress?
// for raw data, maybe!



const App = () => {
  const [experiments, setExperiments] = useState(['-- Loading Experiments --']);
  const [currExperiment, setCurrExperiment] = useState('-- Loading Experiments --');
  const [context, setContext] = useState('');
  const [rawMismatchData, setRawMismatchData] = useState('');
  const [pieChartData, setPieChartData] = useState([1,0]);
  const [lineChartData, setLineChartData] = useState([[],[]])
  const [onlyMismatch, setOnlyMismatch] = useState(false);

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
      fetch(`http://localhost:${process.env.NODE_ENV === 'production' ? '443': '8080'}/experiment/data/?experimentName=${currExperiment}`)
        .then(res => res.json())
        .then(data => {
          console.log('data from experiment');
          console.log(data);
          // We're getting at least a couple types of data here
          // - Raw mismatch data, rolled up data, and context for the experiment
          // - unless we want all the data aggregation to be done client-side.
          setRawMismatchData(data);
          
          const getPieChartData = (data) => {
            //create shallow copy of rawMismatchData and parse down to only mismatch quantities
            const newPieChartData = [0,0];
            for(const el of data){
              if(el.mismatch) newPieChartData[0]++;
              else newPieChartData[1]++;
            }
            console.log('new data:',newPieChartData);
            setPieChartData(newPieChartData);
          }
          getPieChartData(data);
        })
        .catch(err => {
          console.log(`error in fetching experiment data for ${currExperiment}`);
          console.log(err);
        });
    }
  }, [currExperiment]);

  //data to pass to the PieChart component as props. 'pieChartData' is managed in State
  const pieChartDataSet = {
    labels: ['# of Mismatches', '# of Matches'],
  datasets: [
    {
      label: 'Matches vs. Mismatches',
      data: pieChartData,
      backgroundColor: [
        'rgba(54, 162, 235, 0.2)',
        'rgba(75, 192, 192, 0.2)'
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(75, 192, 192, 1)'
      ],
      borderWidth: 1,
    },
  ],
  }

  //data to pass to the LineChart component as props. 'lineChartData' is managed in State
  const lineChartDataSet = {
    labels: ['Control Data', 'Candidate Data'],
    datasets: [{
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
      radius: 0,
      data: [{x:Math.random() * 10, y: Math.random() * 10},{x:Math.random() * 10, y: Math.random() * 10},{x:Math.random() * 10, y: Math.random() * 10},{x:Math.random() * 10, y: Math.random() * 10},{x:Math.random() * 10, y: Math.random() * 10}],
    }, 
    {
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
      radius: 0,
      data: [{x:Math.random() * 10, y: Math.random() * 10},{x:Math.random() * 10, y: Math.random() * 10},{x:Math.random() * 10, y: Math.random() * 10},{x:Math.random() * 10, y: Math.random() * 10},{x:Math.random() * 10, y: Math.random() * 10}],
    }],
  };
  //options to pass to the LineChart component. Refactor and move into LineChart component ASAP
  const lineChartOptions = {
    // animation,
    interaction: {
      intersect: false
    },
    plugins: {
      legend: false 
    },
    scales: {
      x: {
        type: 'linear'
      }
    },
    maintainAspectRatio: false
  };

  const experimentsDropdown = [];
  const contextDropdown = [];
  for (let i = 0; i < experiments.length; i++) {
    experimentsDropdown.push(<Dropdown.Item  style ={{width:'100%'}}key={`experiment${i}`} value={experiments[i]} onClick = {(e) => {setCurrExperiment(experiments[i]);}}>{experiments[i]}</Dropdown.Item>);
  }
  const onlyMismatchOutline = !onlyMismatch ? "outline-primary" : "primary"

  return (
    <>
      <h1>Welcome to Ekho</h1>
      <div className="body">
        <div id="dropdown-body">
          <h4 style ={{fontSize:'2.4vw' }}>Experiment</h4>
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              {currExperiment}
            </Dropdown.Toggle>

            <Dropdown.Menu>{experimentsDropdown}</Dropdown.Menu>
          </Dropdown>
          <ToggleButton
            style ={{width:'100%', fontSize:'1vw', backgroundColor:'rgba(45, 112, 70, 0.664)'}}
            className="mb-2"
            id="toggle-check"
            type="checkbox"
            variant={`${onlyMismatchOutline}`}
            checked={onlyMismatch}
            value="1"
            onClick={(e) => {setOnlyMismatch(!onlyMismatch)}}
          >
            {`Only Display Mismatches`}
          </ToggleButton>
          <DownloadCSV data={rawMismatchData} onlyMismatch={onlyMismatch}/>
        </div>

        <div className="dataVis">
          <DataTable onlyMismatch={onlyMismatch} data={rawMismatchData} />
          <div className='graphs'> 
          <PieChart
            id="pieChart"
            data={pieChartDataSet}
            width={100}
            height={100}
            options={{ maintainAspectRatio: false }}
          />
          <LineChart options={{ lineChartOptions }} data={lineChartDataSet} />
          </div>
        </div>
      </div>
    </>
  );
}

export default App