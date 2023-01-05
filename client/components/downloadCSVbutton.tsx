import React from 'react';
import { CSVLink, CSVDownload } from "react-csv";
import { DBBody } from '../../server/utils/types';

interface DownloadCSVProps {
    data: Data,
    onlyMismatch: boolean
}

interface Data extends DBBody {
    forEach: (el: object, idx?: number) => void
}

// type CSVArray<T> = Array<Array<T>>

//props are includeMismatch and rawMismatchdata 
const DownloadCSV = <T,>({ data, onlyMismatch}: DownloadCSVProps) => {
    const csvData: Array<(string|T)[]> = [['Experiment Name', 'Context', 'Legacy Result', 'Microservice Result', 'Legacy Runtime', 'Microservice Runtime', 'Variance', 'Mismatch', 'Date']];
    if(data){
        data.forEach((el: Data,idx: number)=>{
            //let row = [['Experiment Name','Context', 'Legacy Result', 'Microservice Result','Legacy Runtime', 'Microservice Runtime','Variance', 'Mismatch','Date']]
            if(onlyMismatch){
                if(el.mismatch){
                    csvData.push([el.experimentName,JSON.stringify(el.context), el.resultLegacy,el.resultMS,el.legacyTime as unknown as T,el.msTime as unknown as T,(el.legacyTime - el.msTime) as unknown as T,el.mismatch as unknown as T,el.createdAt as unknown as T])
                }
            }else{
                csvData.push([el.experimentName,JSON.stringify(el.context), JSON.stringify(el.resultLegacy),el.resultMS,el.legacyTime as unknown as T,el.msTime as unknown as T,(el.legacyTime - el.msTime) as unknown as T,el.mismatch as unknown as T,el.createdAt as unknown as T])
            }
        })

    }
    return (
        <CSVLink data={csvData} separator={";"} >Download me</CSVLink>
    )
}

export default DownloadCSV;