import AbstractView from './abstract.js';
import {SortType} from '../consts.js';

const createTripSortTemplate = (sortType) => {

  const title = sortType === SortType.DEFAULT ? `Day` : ``;
  const checkedDefault = sortType === SortType.DEFAULT ? `checked` : ``;
  const checkedTime = sortType === SortType.TIME ? `checked` : ``;
  const checkedPrice = sortType === SortType.PRICE ? `checked` : ``;

  return (
    `<form class="trip-events__trip-sort trip-sort" action="#" method="get">
    <span class="trip-sort__item trip-sort__item--day">${title}</span>

    <div class="trip-sort__item trip-sort__item--event">
      <input id="sort-event" class="trip-sort__input visually-hidden" type="radio" name="trip-sort" value="sort-event" ${checkedDefault}>
      <label class="trip-sort__btn" for="sort-event" data-sort-type="${SortType.DEFAULT}">Event</label>
    </div>

    <div class="trip-sort__item trip-sort__item--time">
      <input id="sort-time" class="trip-sort__input visually-hidden" type="radio" name="trip-sort" value="sort-time" ${checkedTime}>
      <label class="trip-sort__btn" for="sort-time" data-sort-type="${SortType.TIME}">
        Time
        <svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
          <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
        </svg>
      </label>
    </div>

    <div class="trip-sort__item trip-sort__item--price">
      <input id="sort-price" class="trip-sort__input visually-hidden" type="radio" name="trip-sort" value="sort-price" ${checkedPrice}>
      <label class="trip-sort__btn" for="sort-price" data-sort-type="${SortType.PRICE}">
        Price
        <svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
          <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
        </svg>
      </label>
    </div>

    <span class="trip-sort__item trip-sort__item--offers">Offers</span>
  </form>`
  );
};

export default class TripSort extends AbstractView {
  constructor() {
    super();
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
    this._sortType = SortType.DEFAULT;
  }

  getTemplate() {
    return createTripSortTemplate(this._sortType);
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== `LABEL`) {
      return;
    }

    this._sortType = evt.target.dataset.sortType;
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener(`click`, this._sortTypeChangeHandler);
  }
}

