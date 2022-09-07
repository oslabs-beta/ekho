import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

let readLocation;

if (process.env.NODE_ENV === 'test') {
  readLocation = path.join(__dirname, './__mocks__/experiments.yaml');
} else {
  readLocation = path.join(__dirname, '../experiments.yaml');
}

const experiments: any[] = yaml.loadAll(fs.readFileSync(readLocation, 'utf-8'));

export default experiments;
