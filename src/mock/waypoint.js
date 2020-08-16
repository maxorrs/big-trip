import {getRandomInteger} from '../utils/common.js';
const SEVEN_DAYS_MS = 604800000;

const generateType = () => {
  const types = [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`, `Check`, `Sightseeing`, `Restaurant`];

  return types[getRandomInteger(0, types.length - 1)];
};

const generateCity = () => {
  const cities = [`Amsterdam`, `Marrakesh`, `Geneva`, `Warsaw`, `Madrid`];

  return cities[getRandomInteger(0, cities.length - 1)];
};

const generateDescription = () => {
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

const generateDate = () => {
  const currentTime = new Date().getTime();
  const timeGap = SEVEN_DAYS_MS + currentTime;

  const startTimeInMs = new Date(getRandomInteger(currentTime, timeGap));
  const endTimeInMs = new Date(getRandomInteger(startTimeInMs, timeGap));

  const startTime = startTimeInMs.toISOString().substr(0, 16);
  const endTime = endTimeInMs.toISOString().substr(0, 16);

  return {startTime, endTime};
};

export const generateWaypoint = () => {
  return {
    type: generateType(),
    city: generateCity(),
    offers: {
      'luggage': {
        description: `Add luggage`,
        name: `event-offer-luggage`,
        price: 40,
        isEnabled: Boolean(getRandomInteger(0, 1))
      },
      'comfort': {
        description: `Switch to comfort`,
        name: `event-offer-comfort`,
        price: 100,
        isEnabled: Boolean(getRandomInteger(0, 1))
      },
      'meal': {
        description: `Add meal`,
        name: `event-offer-meal`,
        price: 15,
        isEnabled: Boolean(getRandomInteger(0, 1))
      },
      'seats': {
        description: `Choose seats`,
        name: `event-offer-seats`,
        price: 5,
        isEnabled: Boolean(getRandomInteger(0, 1))
      },
      'train': {
        description: `Travel by train`,
        name: `event-offer-train`,
        price: 40,
        isEnabled: Boolean(getRandomInteger(0, 1))
      }
    },
    destination: {
      description: generateDescription(),
      photos: [
        `http://picsum.photos/248/152?r=${Math.random()}`,
        `http://picsum.photos/248/152?r=${Math.random()}`,
        `http://picsum.photos/248/152?r=${Math.random()}`,
        `http://picsum.photos/248/152?r=${Math.random()}`,
        `http://picsum.photos/248/152?r=${Math.random()}`
      ]
    },
    time: generateDate()
  };
};
