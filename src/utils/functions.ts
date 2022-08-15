import { IData } from "../types/props";
import _ from "lodash";

export function getUnixTimestampByElapsedTime(
  startTime: string,
  time_shift: number,
  elapsedTimeCol: number,
  data: IData[]
) {
  const start_time = new Date(startTime);
  const startTimeUnix = start_time.getTime() / 1000;
  const timeShift = time_shift * 60;

  const timeData = data.map((x) => {
    const elapsed = x[elapsedTimeCol] as number;
    const time = new Date(elapsed * 1000);
    return time.getTime() / 1000 + startTimeUnix + timeShift;
  });

  return timeData;
}

export function calculateUnixTimestampGivenFrequency(
  startTime: string,
  time_shift: number,
  frequency: number,
  data: IData[]
) {
  // calculate UNIX timestamp
  const start_time = new Date(startTime);
  const startTimeUnix = start_time.getTime() / 1000;
  const timeShift = time_shift * 60;

  //calculate elapsed time
  const elapsed = _.range(data.length, 1 / frequency);

  const timeData = data.map((x, index) => {
    const time = new Date(elapsed[index]);
    return time.getTime() / 1000 + startTimeUnix + timeShift;
  });

  return timeData;
}
