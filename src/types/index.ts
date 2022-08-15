interface Islurry {
  data: Array<Number>;
  unit: string;
}

export interface ISubmitInfo {
  stage: number;
  well: number;
  offset_min: number;
  time: Array<Number>;
  slurry: Islurry;
  pressure: Islurry;
  prop: Islurry;
  time_shift: number;
}

/*
'{"stage": 42, "well": 43, "offset_min": 0, "time": [[1, 2, 3], [4, 5, 6]], "slurry": {"data": [1, 2, 3], "unit": "bpm"}, "pressure": {"data": [1, 2, 3], "unit": "psi"},
 "prop": {"data": [1, 2, 3], "unit": "ppg"}}'
*/
