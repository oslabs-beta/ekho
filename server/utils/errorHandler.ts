const createErr = (file: string, method: string, err: string) => (`Error in ${file}.${method}. ${err}`);

export default createErr;
