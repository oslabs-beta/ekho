// import { RequestHandler } from "express";

export type ArgsBody = { [key: string]: unknown };

export type ArgsQuery = { [key: string]: unknown };

export type Args = {
  body?: ArgsBody
  params?: string[],
  query?: ArgsQuery,
};

export type Context = {
  [key: string]: unknown
};

export type Criteria = {
  [key: string]: (context: Context, args: Args) => boolean
};

export type LegacyBody = {
  name: string,
  context?: Context,
  args: Args
  runtime: number,
  result: unknown
};

export type Experiment = {
  name: string,
  enabledPct: number,
  method: string,
  apiEndpoint: string,
  flaggedMismatchRules?: {
    name: string,
    criteria: string[],
  }
};
export interface DBBody {
  experimentName: string,
  context: object,
  resultLegacy: string,
  resultMS: string,
  legacyTime: number,
  msTime: number,
  mismatch: boolean,
  ignoredMismatch?: boolean,
  mismatchName?: string
  createdAt: Date
}

export interface PieData extends Iterable<any>{
  context: {
    route: string
  },
createdAt: string,
experimentName: string,
legacyTime: number,
mismatch: boolean,
msTime: string,
resultLegacy: string,
resultMS: string,
__v: number,
_id: string,
}
