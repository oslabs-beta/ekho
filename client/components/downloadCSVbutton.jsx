import React from 'react';
import { CSVLink, CSVDownload } from "react-csv";

//props are includeMismatch and rawMismatchdata 
export default function DownloadCSV(props) {
    const data = props.data;
    const onlyMismatch = props.onlyMismatch;
    const csvData = [['Experiment Name', 'Context', 'Legacy Result', 'Microservice Result', 'Legacy Runtime', 'Microservice Runtime', 'Variance', 'Mismatch', 'Date']];
    if(data){
        data.forEach((el,idx)=>{
            //let row = [['Experiment Name','Context', 'Legacy Result', 'Microservice Result','Legacy Runtime', 'Microservice Runtime','Variance', 'Mismatch','Date']]
            if(onlyMismatch){
                if(el.mismatch){
                    csvData.push([el.experimentName,JSON.stringify(el.context), el.resultLegacy,el.resultMS,el.legacyTime,el.msTime,(el.legacyTime - el.msTime),el.mismatch,el.createdAt])
                }
            }else{
                csvData.push([el.experimentName,JSON.stringify(el.context), JSON.stringify(el.resultLegacy),el.resultMS,el.legacyTime,el.msTime,(el.legacyTime - el.msTime),el.mismatch,el.createdAt])
            }
        })

    }
    return (
        <CSVLink data={csvData} separator={";"} >Download CSV</CSVLink>
    )
}