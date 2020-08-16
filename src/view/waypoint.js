import {COUNT_OFFERS} from '../consts.js';
import {getTime, getTimeRange, getType} from '../utils/waypoint.js';
import AbstractView from './abstract.js';

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

export default class Waypoint extends AbstractView {
  constructor(waypoint) {
    super();
    this._waypoint = waypoint;
    this._clickHandler = this._clickHandler.bind(this);
    this._rollupBtn = this.getElement().querySelector(`.event__rollup-btn`);
  }

  _clickHandler() {
    this._callback.click();
  }

  setEditClickHandler(callback) {
    this._callback.click = callback;
    this._rollupBtn.addEventListener(`click`, this._clickHandler);
  }

  getTemplate() {
    return createWaypointTemplate(this._waypoint);
  }
}
