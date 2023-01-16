import React, { useState, useEffect } from 'react';
import Navbar from '../layouts/Navbar';
import Sidebar from '../layouts/Sidebar';
import DataTable from '../components/DataTable';
import '../stylesheets/style.scss';
import PieChart from '../components/PieChart'
import LineChart from '../components/LineChart'
import { Dropdown } from 'react-bootstrap'
import type { Chart, ChartData, ChartOptions} from 'chart.js'
import { Data } from '../layouts/Sidebar';
import { PieData } from '../../server/utils/types';

// Should we attempt to receive zipped files and decompress?
// for raw data, maybe!

const App = () => {
  const [experiments, setExperiments] = useState(['-- Loading Experiments --']);
  const [currExperiment, setCurrExperiment] = useState('-- Loading Experiments --');
  // const [context, setContext] = useState('');
  const [rawMismatchData, setRawMismatchData] = useState('');
  const [pieChartData, setPieChartData] = useState([1,0]);
  const [lineChartData, setLineChartData] = useState<{ legacy: Array<{x:string, y:string}>, candidate: Array<{x:string, y:string}>}>({"legacy": [], "candidate": []})
  const [onlyMismatch, setOnlyMismatch] = useState(false);
  const [suggestionRenderList, setsuggestionRenderList] = useState(<div></div>)


  // On document load, we want to go grab unique experiments
  const getExperiments = () => {
    // fetch(`http://localhost:${process.env.NODE_ENV === 'production' ? '443': '8080'}/experiments`)
    fetch('/experiments')
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
 
  //autocomplete functionality for navbar experiment search
  const autocomplete = async (value: string, array: Array<string>) => {
    let currentFocus
    const suggestions: React.ReactNode[] = [];
    //reset the list of suggestions on every update
    closeAllLists();
    //only iterate through experiment state for matches if experiment input is not null
    if ((document.querySelector(".experiment-input") as HTMLInputElement).value !== ""){
      currentFocus = -1;
      for (let i = 0; i < array.length; i++){
        if (array[i].slice(0, value.length).toUpperCase() === value.toUpperCase()){
          suggestions.push(<div className="autocomplete-items" key={i} onClick={(e) => {selectSuggestion(array[i])}}>{array[i]}</div>)
        }
      }
      //if there are no matches suggestion array will be empty. Push a "No Results" into the array
      if (suggestions.length === 0) suggestions.push(<div className="autocomplete-items" key={0}>--No Results--</div>)
      console.log("suggestions",JSON.stringify(suggestions))
      //update the suggestion list in state
      //update the suggestion list rendering variable 
      updateRenderList(value, suggestions);
    }
  }
  
  //invokes when user clicks on a autofill suggestion
  const selectSuggestion = (value: string) => {
    setCurrExperiment(value);
    closeAllLists();
    // console.log(value)
    (document.querySelector(".experiment-input") as HTMLInputElement).value = value;
    updateChartsToExperiment();
  }
  
  const closeAllLists = () => {
    if ((document.querySelector(".autocomplete") as HTMLElement).querySelector(".suggestion-container")){
      setsuggestionRenderList(<div></div>);
    }
  }

  const updateRenderList = (value: string, suggestions: React.ReactNode[]) => {
    //update the suggestion list rendering variable to render our list of suggestions
      setsuggestionRenderList(
        (<div className="form-group suggestion-container">
            {suggestions}
        </div> as React.ReactElement<any>)
      )
  }

  const updateChartsToExperiment = () => {
    if (currExperiment !== '-- Loading Experiments --') {
      console.log('experiment has changed, fetching data');
      // TODO: finalize the roue
      // fetch(`http://localhost:${process.env.NODE_ENV === 'production' ? '443': '8080'}/experiment/data/?experimentName=${currExperiment}`)
      fetch(`/experiment/data/?experimentName=${currExperiment}`)
        .then(res => res.json())
        .then(data => {
          console.log('data from experiment');
          console.log(data);
          // We're getting at least a couple types of data here
          // - Raw mismatch data, rolled up data, and context for the experiment
          // - unless we want all the data aggregation to be done client-side.
          setRawMismatchData(data);
          
          const getPieChartData = (data: PieData) => {
            //create shallow copy of rawMismatchData and parse down to only mismatch quantities
            const newPieChartData = [0,0];
            for(const el of data){
              if(el.mismatch) newPieChartData[0]++;
              else newPieChartData[1]++;
            }
            console.log('new Pie data:',data);
            setPieChartData(newPieChartData);
          }
          getPieChartData(data);

          const getLineChartData = (data: PieData) => {
            //dataset1 and dataset 2 iterate through the array of docs and set x: date and y: runtime
            const dataSet1: Array<{x:string, y:string}> = [];
            const dataSet2: Array<{x:string, y:string}> = [];
            for (const el of data){
              let legacy = {
                x: el._id,
                y: el.legacyTime
              };
              let candidate = {
                x: el._id,
                y: el.msTime
              };
              dataSet1.push(legacy);
              dataSet2.push(candidate);
            }
            console.log("dataset1:", dataSet1)
            console.log("dataset2:", dataSet2)
            setLineChartData({"legacy": dataSet1, "candidate": dataSet2})
          }
          getLineChartData(data);
        })
        .catch(err => {
          console.log(`error in fetching experiment data for ${currExperiment}`);
          console.log(err);
        });
    }
  }

  // const lineChartDataSet = {
  //   labels: ['Control Data', 'Candidate Data'],
  //   datasets: [{
  //     borderColor: 'rgba(54, 162, 235, 1)',
  //     borderWidth: 1,
  //     radius: 0,
  //     data: [{x:Math.random() * 10, y: Math.random() * 10},{x:Math.random() * 10, y: Math.random() * 10},{x:Math.random() * 10, y: Math.random() * 10},{x:Math.random() * 10, y: Math.random() * 10},{x:Math.random() * 10, y: Math.random() * 10}],
  //   }, 
  //   {
  //     borderColor: 'rgba(75, 192, 192, 1)',
  //     borderWidth: 1,
  //     radius: 0,
  //     data: [{x:Math.random() * 10, y: Math.random() * 10},{x:Math.random() * 10, y: Math.random() * 10},{x:Math.random() * 10, y: Math.random() * 10},{x:Math.random() * 10, y: Math.random() * 10},{x:Math.random() * 10, y: Math.random() * 10}],
  //   }],
  // };

  //closes the list of suggestions appended to the nav searchbar

  /* Uncomment when middleware is working 
  */
  useEffect(() => {getExperiments()}, []);

  // When the user selects an experiment, we want to go grab the data
  useEffect(() => {updateChartsToExperiment()}, [currExperiment]);

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
      label: 'Control Data',
      borderColor: 'rgba(999, 162, 235, 1)',
      borderWidth: 1,
      radius: 0,
      data: lineChartData["legacy"],
    }, 
    {
      label: 'Candidate Data',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
      radius: 0,
      data: lineChartData["candidate"],
    }],
  };

  //options to pass to the LineChart component. Refactor and move into LineChart component ASAP
  const lineChartOptions = {
    // animation,
    responsive: true,
    interaction: {
      intersect: false
    },
    plugins: {
      legend: false,
      title: {
        display: true,
        text: 'Runtimes'
      }
    },
    scales: {
      x: {
        type: 'linear'
      },
      y: {
        
      }
    },
    maintainAspectRatio: false
  };

  const experimentsDropdown: Array<React.ReactNode> = [];
  // const contextDropdown = [];
  for (let i = 0; i < experiments.length; i++) {
    experimentsDropdown.push(<Dropdown.Item  style ={{width:'100%'}}key={`experiment${i}`} value={experiments[i]} onClick = {(e) => {setCurrExperiment(experiments[i]);}}>{experiments[i]}</Dropdown.Item>);
  }
  const onlyMismatchOutline = !onlyMismatch ? "outline-primary" : "primary"

  return (
    <>
      <Navbar suggestionList={suggestionRenderList} autocompleteFunc={autocomplete} experiments={experiments}/>
      
      {/*div that envelops the entire webpage except for navbar*/}
      <div className="body">
        <Sidebar 
        currExperiment={currExperiment} 
        experimentsDropdown={experimentsDropdown} 
        mismatch={onlyMismatch} 
        setMismatch={setOnlyMismatch} 
        rawMismatchData={rawMismatchData as unknown as Data}
        />
        <div className="dataVis">
          <DataTable 
          onlyMismatch={onlyMismatch} 
          data={rawMismatchData as unknown as Data} 
          />
          <div className='graphs'> 
            <PieChart
              id="pieChart"
              data={pieChartDataSet}
              width={100}
              height={100}
              options={{ maintainAspectRatio: false }}
            />
            <LineChart 
            options={(lineChartOptions as unknown as ChartOptions)}  
            data={lineChartDataSet as unknown as ChartData<'line'>} 
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default App