const checkRequiredProps = (body) => {
  if (!body) throw new Error('request missing body');
  const missingFields = [];
  if (!Object.hasOwn(body, 'name')) missingFields.push('name');
  if (!Object.hasOwn(body, 'args')) missingFields.push('args');
  if (!Object.hasOwn(body, 'runtime')) missingFields.push('runtime');
  if (!Object.hasOwn(body, 'result')) missingFields.push('result');
  if (missingFields.length) return `missing required field(s): ${missingFields.join(', ')}`;
};

const checkTypes = (body) => {
  // TODO: Figure out whether args must be an array or if we can code such that we can accept any
  // if (!Array.isArray(body.input)) return 'a must be an array';
  if (Object.hasOwn(body, 'context') && (typeof body.context !== 'object' || Array.isArray(body.context))) return 'If provided, context must be an object';
  if (typeof body.runtime !== 'number') return 'runtime should be a number representing function runtime in ms';
};

module.exports = { checkRequiredProps, checkTypes };
