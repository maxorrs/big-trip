import {getRandomInteger} from '../utils/common.js';
import {types, getOffers, generateDescription} from '../utils/waypoint.js';

const SEVEN_DAYS_MS = 604800000;
const MAX_PRICE = 500;

const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

const generateType = () => {
  const typeValues = Object
    .values(types);

  let allTypes = [];

  for (const type of typeValues) {
    allTypes.push(...type);
  }

  return allTypes[getRandomInteger(0, allTypes.length - 1)];
};

const generateCity = () => {
  const cities = [`Amsterdam`, `Marrakesh`, `Geneva`, `Warsaw`, `Madrid`];

  return cities[getRandomInteger(0, cities.length - 1)];
};

const generateStartDate = () => {
  const currentTime = new Date().getTime();
  const timeGap = SEVEN_DAYS_MS + currentTime;

  const startDate = new Date(getRandomInteger(currentTime, timeGap)).toISOString();


  return startDate;
};

const generateEndDate = (startDate) => {
  const currentTime = new Date().getTime();
  const timeGap = SEVEN_DAYS_MS + currentTime;

  const startDateInMs = new Date(startDate).getTime();
  const endDate = new Date(getRandomInteger(startDateInMs, timeGap)).toISOString();

  return endDate;
};

export const generateWaypoint = () => {
  return {
    id: generateId(),
    type: generateType(),
    city: generateCity(),
    price: getRandomInteger(0, MAX_PRICE),
    offers: getOffers(generateType()),
    description: generateDescription(),
    photos: [
      `http://picsum.photos/248/152?r=${Math.random()}`,
      `http://picsum.photos/248/152?r=${Math.random()}`,
      `http://picsum.photos/248/152?r=${Math.random()}`,
      `http://picsum.photos/248/152?r=${Math.random()}`,
      `http://picsum.photos/248/152?r=${Math.random()}`
    ],
    startDate: generateStartDate(),
    endDate: generateEndDate(generateStartDate()),
    isFavorite: Boolean(getRandomInteger(0, 1))
  };
};
