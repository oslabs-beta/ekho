import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

/*
* On call, reload the experiments file if stale so that intraday changes are picked up
* Possible alternative: use FS to check the file's lastmodified timestamp? maybe faster?
*/

const REFRESH_INTERVAL = 5000;

let readLocation: string;
if (process.env.NODE_ENV === 'test') {
  readLocation = path.join(__dirname, './__mocks__/experiments.yaml');
} else {
  readLocation = path.join(__dirname, '../../experiments.yaml');
}

let refreshTime: number = Date.now() - REFRESH_INTERVAL - 1;
let experiments: any[];

const getExperiments = () => {
  if (Date.now() - refreshTime > REFRESH_INTERVAL) {
    experiments = yaml.loadAll(fs.readFileSync(readLocation, 'utf-8'));
    refreshTime = Date.now();
  }

  return experiments;
};

export default getExperiments;
