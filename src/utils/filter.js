import {FilterType, Tense} from '../consts.js';
import {isFutureOrPast} from '../utils/date.js';

export const filter = {
  [FilterType.EVERYTHING]: (waypoints) => waypoints,
  [FilterType.FUTURE]: (waypoints) => waypoints.filter((waypoint) => isFutureOrPast(waypoint.startDate, Tense.FUTURE)),
  [FilterType.PAST]: (waypoints) => waypoints.filter((waypoint) => isFutureOrPast(waypoint.startDate, Tense.PAST))
};
