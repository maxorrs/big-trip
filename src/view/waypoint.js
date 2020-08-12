import {COUNT_OFFERS} from '../consts.js';
import {createElement} from '../util.js';

const getTime = (time) => {
  const val = new Date(time);
  const hours = `${val.getHours() < 10 ? `0` : ``}${val.getHours()}`;

  const minutes = `${val.getMinutes() < 10 ? `0` : ``}${val.getMinutes()}`;
  const result = `${hours}:${minutes}`;

  return result;
};

const getTimeRange = (timeObj) => {
  const startTimeInMs = new Date(timeObj.startTime).getTime();
  const endTimeInMs = new Date(timeObj.endTime).getTime();
  const maxValueMinutes = 59;
  const timeInHour = 60;
  const timeInDay = 24;

  const diffTime = new Date(endTimeInMs - startTimeInMs);
  const minutes = diffTime.getMinutes();
  const hours = diffTime.getHours() * timeInHour;
  const days = diffTime.getDate() * timeInHour * timeInDay;
  const sumMin = minutes + hours + days;

  let result;
  if (sumMin <= maxValueMinutes) {
    result = `${sumMin}M`;
  } else {
    const minutesValue = sumMin % timeInHour;
    const remainsMinutes = sumMin - minutesValue;
    const hoursValue = remainsMinutes / timeInHour % timeInDay;
    const remainsHours = remainsMinutes / timeInHour - hoursValue;
    const daysValue = remainsHours / timeInDay;

    result = daysValue ? `${daysValue}D ${hoursValue}H ${minutesValue}M` : `${hoursValue}H ${minutesValue}M`;
  }
  return result;
};

const getType = (type) => {
  let result = ``;

  switch (type) {
    case `Check`:
    case `Sightseeing`:
    case `Restaurant`:
      result = `${type} in`;
      break;
    default:
      result = `${type} to`;
      break;
  }

  return result;
};

const createWaypointTemplate = (waypoint) => {
  const startTime = getTime(waypoint.time.startTime);
  const endTime = getTime(waypoint.time.endTime);

  const diffTime = getTimeRange(waypoint.time);
  const nameImage = waypoint.type === `Check` ? `Check-in` : waypoint.type;
  const type = getType(waypoint.type);

  const offers = Object
    .values(waypoint.offers)
    .filter((it) => {
      return it.isEnabled;
    });

  const enabledOffers = offers
    .slice(0, COUNT_OFFERS);

  let offersListCode = [];
  for (let i = 0; i < enabledOffers.length; i++) {
    offersListCode += `
      <li class="event__offer">
        <span class="event__offer-title">${enabledOffers[i].description}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${enabledOffers[i].price}</span>
      </li>
    `;
  }

  const sumPrice = offers
    .map((it) => {
      return it.price;
    })
    .reduce((total, value) => {
      return total + value;
    }, 0);

  return (
    `<li class="trip-events__item">
    <div class="event">
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${nameImage}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${waypoint.city}</h3>

      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${waypoint.time.startTime}">${startTime}</time>
          &mdash;
          <time class="event__end-time" datetime="${waypoint.time.endTime}">${endTime}</time>
        </p>
        <p class="event__duration">${diffTime}</p>
      </div>

      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${sumPrice}</span>
      </p>

      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${offersListCode}
      </ul>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`
  );
};

export default class Waypoint {
  constructor(waypoint) {
    this._element = null;
    this._waypoint = waypoint;
  }

  getTemplate() {
    return createWaypointTemplate(this._waypoint);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
