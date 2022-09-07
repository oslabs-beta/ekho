/*
* Provide reusable conditions and names for use with experiments.yaml
* Conditions were removed from experiments.yaml to avoid security vulnerabilities
*/

import { Criteria } from './types';

const criteria: Criteria = {
  // Sample criteria
  missingEmail: (context, args) => (!context.email),
  badUserData: (context, args) => context.created < new Date('2022-01-01'),
  unsupportedUserTypes: (context, args) => (context.usertype === 'admin' || args.body.usertype === 'test'),
};

export default criteria;
