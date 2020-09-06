import {types} from '../utils/waypoint.js';
import moment from 'moment';

const WaypointType = {
  TAXI: `taxi`,
  BUS: `bus`,
  TRAIN: `train`,
  SHIP: `ship`,
  TRANSPORT: `transport`,
  DRIVE: `drive`,
  FLIGHT: `flight`,
  CHECK: `check`,
  SIGHTSEEING: `sightseeing`,
  RESTAURANT: `restaurant`
};

const LabelStat = {
  [WaypointType.TAXI]: `🚕 RIDE`,
  [WaypointType.BUS]: `🚌 BUS`,
  [WaypointType.TRAIN]: `🚂 TRAIN`,
  [WaypointType.SHIP]: `🛳 SAIL`,
  [WaypointType.TRANSPORT]: `🚊 TRANSPORT`,
  [WaypointType.DRIVE]: `🚗 DRIVE`,
  [WaypointType.FLIGHT]: `✈️ FLY`,
  [WaypointType.CHECK]: `🏨 STAY`,
  [WaypointType.SIGHTSEEING]: `🏛 LOOK`,
  [WaypointType.RESTAURANT]: `🍽 EAT`
};

const getUniqueStats = (newArr, item) => {
  const itemValue = item.value ? item.value : 1;
  const itemType = item.type === `check-in` ? `check` : item.type;

  if (LabelStat[itemType] in newArr) {
    newArr[LabelStat[itemType]] += itemValue;
  } else {
    newArr[LabelStat[itemType]] = itemValue;
  }

  return newArr;
};

export const getStatsForMoney = (waypoints) => {
  const stats = Object
    .values(waypoints)
    .map((item) => {
      return {
        type: item.type,
        value: item.price
      };
    })
    .reduce(getUniqueStats, []);

  return sortStats(stats);
};

export const getStatsForTransport = (waypoints) => {
  const typesOfTransport = types.transport;
  const stats = Object
    .values(waypoints)
    .filter((item) => {
      return typesOfTransport.some((type) => type === item.type);
    })
    .map((item) => {
      return {
        type: item.type
      };
    })
    .reduce(getUniqueStats, []);

  return sortStats(stats);
};

const getDuration = (waypoint) => {
  const startDate = waypoint.startDate;
  const endDate = waypoint.endDate;

  const duration = moment.duration(moment(endDate).diff(startDate)).asHours();
  return Math.round(duration);
};

export const getStatsForTimeSpent = (waypoints) => {
  const stats = Object
    .values(waypoints)
    .map((item) => {
      return {
        type: item.type,
        value: getDuration(item)
      };
    })
    .reduce(getUniqueStats, []);

  return sortStats(stats);
};

const sortStats = (unsorteStats) => {
  const sortable = Object
    .entries(unsorteStats)
    .reduce((newArr, item) => {
      newArr.push(item);

      return newArr;
    }, [])
    .sort((a, b) => b[1] - a[1]);

  const labels = Object
    .values(sortable)
    .map((item) => item[0]);

  const values = Object
    .values(sortable)
    .map((item) => item[1]);

  return {
    labelsData: labels,
    valuesData: values
  };
};
