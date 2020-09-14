import {capitalizeFirstLetter} from './common.js';
import {getMomemtWithTimeZone} from '../utils/date.js';

const MAX_COUNT_CITY_INFO = 3;

export const WaypointMode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export const State = {
  SAVING: `SAVING`,
  DELETING: `DELETING`,
  ABORTING: `ABORTING`
};

export const getSumWaypoint = (waypoint) => {
  const amount = Object
    .values(waypoint.offers)
    .filter((it) => {
      return it.isEnabled;
    })
    .map((it) => {
      return it.price;
    })
    .reduce((total, value) => {
      return total + value;
    }, 0);

  return amount;
};

export const getType = (type) => {
  const typeChange = type === `check-in` ? `check` : type;

  switch (typeChange) {
    case `check`:
    case `sightseeing`:
    case `restaurant`:
      return `${capitalizeFirstLetter(typeChange)} in`;
    default:
      return `${capitalizeFirstLetter(typeChange)} to`;
  }
};

export const defaultSortWaypoints = (a, b) => {
  const firstDate = new Date(a.startDate).getTime();
  const secondDate = new Date(b.startDate).getTime();

  if (firstDate > secondDate) {
    return 1;
  } else if (firstDate < secondDate) {
    return -1;
  }

  return 0;
};

export const sortTime = (a, b) => {
  const timeA = new Date(a.endDate).getTime() - new Date(a.startDate).getTime();
  const timeB = new Date(b.endDate).getTime() - new Date(b.startDate).getTime();

  if (timeA < timeB) {
    return 1;
  } else if (timeA > timeB) {
    return -1;
  }

  return 0;
};

export const sortPrice = (a, b) => {
  const priceA = a.price;
  const priceB = b.price;

  if (priceA < priceB) {
    return 1;
  } else if (priceA > priceB) {
    return -1;
  }

  return 0;
};

export const types = {
  transport: [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`],
  transfer: [`check`, `sightseeing`, `restaurant`]
};

export const getOffers = (offers, type) => {
  const offersList = offers;

  const currentOffers = Object
    .values(offersList)
    .filter((item) => item.type === type)
    .map((item) => item.offers);

  return currentOffers[0];
};

export const getDestinationInfo = (destinations, type) => {
  const blank = {
    name: ``,
    description: ``,
    pictures: []
  };

  const destinationsList = destinations;

  const currentDestination = Object
    .values(destinationsList)
    .filter((item) => item.name === type);

  return currentDestination[0] || blank;
};

export const getUniqueDates = (waypoints) => {
  return new Set(waypoints
    .slice()
    .map((waypoint) => getMomemtWithTimeZone(waypoint.startDate).format(`YYYY-MM-DD`))
    .sort()
  );
};

export const getCities = (waypoints) => {
  return waypoints
  .slice()
  .map((waypoint) => {
    return {
      city: waypoint.destination.name,
      startDate: waypoint.startDate
    };
  })
  .sort(defaultSortWaypoints);
};

export const getUniqueCitiesDatalist = (waypoints) => {
  const cities = getCities(waypoints);

  return new Set(cities
  .slice()
  .map((it) => {
    return it.city;
  })
  .sort());
};

export const getCitiesForInfo = (waypoints) => {
  const cities = getCities(waypoints);

  let citiesForInfo = [];

  if (cities.length > MAX_COUNT_CITY_INFO) {
    citiesForInfo.push(cities[0].city);
    citiesForInfo.push(`...`);
    citiesForInfo.push(cities[cities.length - 1].city);
  } else {
    citiesForInfo = cities
    .slice()
    .map((it) => {
      return it.city;
    });
  }

  return citiesForInfo;
};

const getAmountEnabledOffers = (waypoints) => {
  return Object
    .values(waypoints)
    .filter((waypoint) => waypoint.offers.length !== 0)
    .map((waypoint) => waypoint.offers)
    .reduce((total, offers) => {
      for (const offer of offers) {
        if (offer.isEnabled) {
          total += offer.price;
        }
      }
      return total;
    }, 0);
};

const getAmountAllWaypoints = (waypoints) => {
  return Object
    .values(waypoints)
    .reduce((total, value) => {
      total += value.price;
      return total;
    }, 0);
};


export const getFinalAmount = (waypoints) => {
  const amountAllWaypoints = getAmountAllWaypoints(waypoints);
  const amountEnabledOffers = getAmountEnabledOffers(waypoints);
  const finalAmount = amountAllWaypoints + amountEnabledOffers;

  return finalAmount;
};
