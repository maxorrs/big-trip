import {types} from '../utils/waypoint.js';
import moment from 'moment';

const WaypointType = {
  TAXI: `Taxi`,
  BUS: `Bus`,
  TRAIN: `Train`,
  SHIP: `Ship`,
  TRANSPORT: `Transport`,
  DRIVE: `Drive`,
  FLIGHT: `Flight`,
  CHECK: `Check`,
  SIGHTSEEING: `Sightseeing`,
  RESTAURANT: `Restaurant`
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

export const getStatsForMoney = (waypoints) => {
  let bank = {};
  Object
    .values(waypoints)
    .map((item) => {
      const typeWaypoint = item.type === `Check-in` ? `Check` : item.type;
      return {
        type: typeWaypoint,
        price: item.price
      };
    })
    .reduce((_, value) => {
      if ([LabelStat[value.type]] in bank) {
        bank[LabelStat[value.type]] += value.price;
      } else {
        bank[LabelStat[value.type]] = value.price;
      }
    }, 0);

  let sortable = [];

  for (const type in bank) {
    if (bank.hasOwnProperty(type)) {
      sortable.push([type, bank[type]]);
    }
  }
  sortable.sort((a, b) => b[1] - a[1]);

  let labels = [];
  let prices = [];
  sortable.forEach((value) => labels.push(value[0]));
  sortable.forEach((value) => prices.push(value[1]));

  return {
    labelsStat: labels,
    valuesStat: prices
  };
};

export const getStatsForTransport = (waypoints) => {
  const typesActivity = types.activity;
  let bank = {};
  Object
    .values(waypoints)
    .map((item) => {
      const typeWaypoint = item.type === `Check-in` ? `Check` : item.type;
      for (const type of typesActivity) {
        if (typeWaypoint === type && LabelStat[typeWaypoint] in bank) {
          bank[LabelStat[typeWaypoint]] += 1;
        } else if (typeWaypoint === type) {
          bank[LabelStat[typeWaypoint]] = 1;
        }
      }
    });

  let sortable = [];

  for (const type in bank) {
    if (bank.hasOwnProperty(type)) {
      sortable.push([type, bank[type]]);
    }
  }
  sortable.sort((a, b) => b[1] - a[1]);

  let labels = [];
  let count = [];
  sortable.forEach((value) => labels.push(value[0]));
  sortable.forEach((value) => count.push(value[1]));

  return {
    labelsStat: labels,
    valuesStat: count
  };
};

const getDuration = (waypoint) => {
  const startDate = waypoint.startDate;
  const endDate = waypoint.endDate;

  const duration = moment.duration(moment(endDate).diff(startDate)).asHours();
  return Math.round(duration);
};

export const getStatsForTimeSpent = (waypoints) => {
  let bank = {};
  Object
    .values(waypoints)
    .map((item) => {
      const typeWaypoint = item.type === `Check-in` ? `Check` : item.type;
      return {
        type: typeWaypoint,
        duration: getDuration(item)
      };
    })
    .reduce((_, item) => {
      if (LabelStat[item.type] in bank) {
        bank[LabelStat[item.type]] += item.duration;
      } else {
        bank[LabelStat[item.type]] = item.duration;
      }
    }, 0);

  let sortable = [];

  for (const type in bank) {
    if (bank.hasOwnProperty(type)) {
      sortable.push([type, bank[type]]);
    }
  }
  sortable.sort((a, b) => b[1] - a[1]);

  let labels = [];
  let diff = [];
  sortable.forEach((value) => labels.push(value[0]));
  sortable.forEach((value) => diff.push(value[1]));

  return {
    labelsStat: labels,
    valuesStat: diff
  };
};
