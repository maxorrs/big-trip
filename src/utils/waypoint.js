import {getRandomInteger} from './common.js';

export const NameMonth = {
  1: `JAN`,
  2: `FEB`,
  3: `MAR`,
  4: `APR`,
  5: `MAY`,
  6: `JUN`,
  7: `JUL`,
  8: `AUG`,
  9: `SEM`,
  10: `OCT`,
  11: `NOV`,
  12: `DEC`
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
  let result = ``;
  const typeChange = type === `Check-in` ? `Check` : type;

  switch (typeChange) {
    case `Check`:
    case `Sightseeing`:
    case `Restaurant`:
      result = `${typeChange} in`;
      break;
    default:
      result = `${typeChange} to`;
      break;
  }

  return result;
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
  activity: [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`],
  transfer: [`Check`, `Sightseeing`, `Restaurant`]
};

export const getOffers = (type, update) => {
  type = type === `Check-in` ? `Check` : type;

  let flagIsEnabled = Boolean(getRandomInteger(0, 1));

  if (update) {
    flagIsEnabled = false;
  }

  const offers = {
    'Bus': {
      '1-bus': {
        description: `Bus-1`,
        name: `event-offer-bus-2`,
        price: 400,
        isEnabled: flagIsEnabled
      },
      '2-bus': {
        description: `Bus-2`,
        name: `event-offer-bus-1`,
        price: 2400,
        isEnabled: flagIsEnabled
      }
    },
    'Taxi': {
      '1-taxi': {
        description: `Taxi-1`,
        name: `event-offer-taxi-2`,
        price: 30,
        isEnabled: flagIsEnabled
      },
      '2-taxi': {
        description: `Taxi-2`,
        name: `event-offer-taxi-1`,
        price: 900,
        isEnabled: flagIsEnabled
      }
    },
    'Train': {
      'luggage': {
        description: `Train-1`,
        name: `event-offer-luggage`,
        price: 40,
        isEnabled: flagIsEnabled
      },
      'comfort': {
        description: `Train-2`,
        name: `event-offer-comfort`,
        price: 100,
        isEnabled: flagIsEnabled
      },
    },
    'Ship': {
      'luggage': {
        description: `Ship-1`,
        name: `event-offer-luggage`,
        price: 40,
        isEnabled: flagIsEnabled
      }
    },
    'Transport': {
      'luggage': {
        description: `Transport-1`,
        name: `event-offer-luggage`,
        price: 40,
        isEnabled: flagIsEnabled
      }
    },
    'Drive': {
      'luggage': {
        description: `Drive-1`,
        name: `event-offer-luggage`,
        price: 40,
        isEnabled: flagIsEnabled
      }
    },
    'Flight': {
      'luggage': {
        description: `Flight-1`,
        name: `event-offer-luggage`,
        price: 40,
        isEnabled: flagIsEnabled
      }
    },
    'Check': {
      'luggage': {
        description: `Check-1`,
        name: `event-offer-luggage`,
        price: 40,
        isEnabled: flagIsEnabled
      }
    },
    'Sightseeing': {
      'luggage': {
        description: `Sightseeing-1`,
        name: `event-offer-luggage`,
        price: 40,
        isEnabled: flagIsEnabled
      }
    },
    'Restaurant': {
      'luggage': {
        description: `Restaurant-1`,
        name: `event-offer-luggage`,
        price: 40,
        isEnabled: flagIsEnabled
      }
    }
  };

  const newType = type.toString();

  return offers[newType];
};

export const generateDescription = () => {
  const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
  Cras aliquet varius magna, non porta ligula feugiat eget. 
  Fusce tristique felis at fermentum pharetra. 
  Aliquam id orci ut lectus varius viverra. 
  Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. 
  Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. 
  Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. 
  Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. 
  Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

  const descriptions = text.split(`. `);

  return `${descriptions[getRandomInteger(0, descriptions.length - 1)]}.`;
};
