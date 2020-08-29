
import SmartView from './smart.js';
import {createPhoto, getDatalist} from '../utils/event.js';
import {formatDateForEditComponent} from '../utils/date.js';
import {types, getType, getOffers, generateDescription} from '../utils/waypoint.js';
import flatpickr from 'flatpickr';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const BLANK_WAYPOINT = {
  type: `Taxi`,
  city: ``,
  price: ``,
  offers: getOffers(`Taxi`, true),
  description: ``,
  photos: [],
  startDate: new Date(),
  endDate: new Date(),
  isFavorite: false
};

const createControlsTemplate = (isFavorite, isNew) => {
  return (
    `${isNew
      ?
      `<button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Cancel</button>`
      :
      `<button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>

      <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
      <label class="event__favorite-btn" for="event-favorite-1">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </label>

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Close event</span>
      </button>`
    }`
  );
};

const createTypeActivityTemplate = (data) => {
  return (Object
    .values(types.activity)
    .map((activity) => {
      return (
        `<div class="event__type-item">
          <input id="event-type-${activity}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${activity}" ${data.type === activity ? `checked` : ``}>
          <label class="event__type-label  event__type-label--${activity.toLowerCase()}" for="event-type-${activity}-1">${activity}</label>
        </div>`
      );
    })
  ).join(``);
};

const createTypeTransferTemplate = (data) => {
  return (Object.
    values(types.transfer)
    .map((transfer) => {
      const type = transfer === `Check` ? `Check-in` : transfer;
      return (
        `<div class="event__type-item">
          <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${data.type === transfer ? `checked` : ``}>
          <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type}-1">${transfer}</label>
        </div>`
      );
    })
  ).join(``);
};

const createOffersTemplate = (data) => {
  return (Object
    .values(data.offers)
    .map((item) => {
      return (
        `<div class="event__offer-selector">
          <input class="event__offer-checkbox visually-hidden" id="${item.name}-1" type="checkbox" name="${item.name}" ${item.isEnabled ? `checked` : ``}>
            <label class="event__offer-label" for="${item.name}-1">
              <span class="event__offer-title">${item.description}</span>
                &plus;
                &euro;&nbsp;<span class="event__offer-price">${item.price}
              </span>
          </label>
        </div>`
      );
    }).join(``)
  );
};

const createEventTemplate = (data = BLANK_WAYPOINT, isNewWaypoint) => {
  const {city, isFavorite, price, photos, description, startDate, endDate, type} = data;
  const photosTemplate = createPhoto(photos);
  const startTimeValue = formatDateForEditComponent(startDate);
  const endTimeValue = formatDateForEditComponent(endDate);
  const typeForAttr = type === `Check` ? `check-in` : type.toLowerCase();
  const typeText = getType(type);
  const datalist = getDatalist();
  const isNew = isNewWaypoint;

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${typeForAttr}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Transfer</legend>
            ${createTypeActivityTemplate(data)}
          </fieldset>

          <fieldset class="event__type-group">
            <legend class="visually-hidden">Activity</legend>
            ${createTypeTransferTemplate(data)}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${typeText}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${city}" list="destination-list-1" placeholder="select destination..." required>
        <datalist id="destination-list-1">
          ${datalist}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">
          From
        </label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startTimeValue}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">
          To
        </label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endTimeValue}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}" required>
      </div>

      ${createControlsTemplate(isFavorite, isNew)}
      
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
          ${createOffersTemplate(data)}
        </div>
      </section>

      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        ${description ? `<p class="event__destination-description">${description}</p>` : ``}

        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${photosTemplate}
          </div>
        </div>
      </section>
    </section>
  </form>`
  );
};

export default class EditEvent extends SmartView {
  constructor(isNewWaypoint = false, waypoint = BLANK_WAYPOINT) {
    super();
    this._data = EditEvent.parseWaypointToData(waypoint);
    this._startDatepicker = null;
    this._endDatepicker = null;
    this._isNewWaypoint = isNewWaypoint;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._clickCloseHandler = this._clickCloseHandler.bind(this);
    this._favoriteHandler = this._favoriteHandler.bind(this);
    this._destinationInputHandler = this._destinationInputHandler.bind(this);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._clickDeleteHandler = this._clickDeleteHandler.bind(this);
    this._priceInputHandler = this._priceInputHandler.bind(this);

    this._startDateChangeHandler = this._startDateChangeHandler.bind(this);
    this._endDateChangeHandler = this._endDateChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setStartDatepicker();
    this._setEndDatepicker();
  }

  removeElement() {
    super.removeElement();

    if (this._startDatepicker && this._endDatepicker) {
      this._startDatepicker.destroy();
      this._endDatepicker.destroy();

      this._startDatepicker = null;
      this._endDatepicker = null;
    }
  }

  _setStartDatepicker() {
    if (this._startDatepicker) {
      this._startDatepicker.destroy();
      this._startDatepicker = null;
    }

    this._startDatepicker = flatpickr(
        this.getElement().querySelector(`#event-start-time-1`),
        {
          dateFormat: `d/m/y H:i`,
          enableTime: true,
          time24hr: true,
          defaultDate: this._data.startDate,
          onChange: this._startDateChangeHandler
        }
    );
  }

  _setEndDatepicker() {
    if (this._endDatepicker) {
      this._endDatepicker.destroy();
      this._endDatepicker = null;
    }

    this._endDatepicker = flatpickr(
        this.getElement().querySelector(`#event-end-time-1`),
        {
          dateFormat: `d/m/y H:i`,
          enableTime: true,
          time24hr: true,
          defaultDate: this._data.endDate,
          minDate: this._data.startDate,
          onChange: this._endDateChangeHandler
        }
    );
  }

  _startDateChangeHandler(selectedDates) {
    this.updateData({
      startDate: new Date(selectedDates[0]).toISOString()
    }, true);
  }

  _endDateChangeHandler(selectedDates) {
    this.updateData({
      endDate: new Date(selectedDates[0]).toISOString()
    }, true);
  }

  static parseWaypointToData(waypoint) {
    return Object
      .assign(
          {},
          waypoint
      );
  }

  static parseDataToWaypoint(data) {
    data = Object.assign({}, data);

    return data;
  }

  reset(waypoint) {
    this
      .updateData(
          EditEvent.parseWaypointToData(waypoint)
      );
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.submit(this._data);
  }

  setFormSubmitHandler(callback) {
    this._callback.submit = callback;
    this.getElement().addEventListener(`submit`, this._formSubmitHandler);
  }

  _clickCloseHandler(evt) {
    evt.preventDefault();
    this._callback.close();
  }

  setClickCloseHandler(callback) {
    this._callback.close = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._clickCloseHandler);
  }

  _clickDeleteHandler(evt) {
    evt.preventDefault();
    this._callback.delete(EditEvent.parseDataToWaypoint(this._data));
  }

  setClickDeleteHandler(callback) {
    this._callback.delete = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._clickDeleteHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.submit);
    this.setClickDeleteHandler(this._callback.delete);
    this._setStartDatepicker();
    this._setEndDatepicker();

    if (!this._isNewWaypoint) {
      this.setClickCloseHandler(this._callback.close);
    }
  }

  _setInnerHandlers() {
    if (!this._isNewWaypoint) {
      this.getElement().querySelector(`.event__favorite-btn`).addEventListener(`click`, this._favoriteHandler);
    }
    this.getElement().querySelector(`.event__input--destination`).addEventListener(`input`, this._destinationInputHandler);
    const typeContainers = this.getElement().querySelectorAll(`.event__type-input`);

    for (const container of typeContainers) {
      container.addEventListener(`input`, this._typeChangeHandler);
    }

    this.getElement().querySelector(`.event__input--price`).addEventListener(`input`, this._priceInputHandler);

  }

  getTemplate() {
    return createEventTemplate(this._data, this._isNewWaypoint);
  }

  _favoriteHandler(evt) {
    evt.preventDefault();
    this.updateData({
      isFavorite: !this._data.isFavorite
    });
  }

  _destinationInputHandler(evt) {

    evt.preventDefault();

    // Завел пока даталист с городами через костыль, потому что не понимаю, как будет приходить список с сервера.
    const uniqueCitiesDatalist = new Set([`Amsterdam`, `Geneva`, `Madrid`, `Marrakesh`, `Warsaw`]);

    const regExpDatalist = new RegExp(Array.from(uniqueCitiesDatalist).join(`$|`), `y`);

    if (!evt.target.value) {
      evt.target.setCustomValidity(`Select a destination from the list.`);
    } else if (!evt.target.value.match(regExpDatalist)) {
      evt.target.setCustomValidity(`The selected destination does not exist.`);
    } else {
      evt.target.setCustomValidity(``);
    }

    this.updateData({
      city: evt.target.value
    }, true);
  }

  _typeChangeHandler(evt) {
    evt.preventDefault();

    this.updateData({
      type: evt.target.value,
      offers: getOffers(evt.target.value, true),
      description: generateDescription()
    });
  }

  _priceInputHandler(evt) {
    evt.preventDefault();

    if (evt.target.value.match(/\D/g)) {
      evt.target.setCustomValidity(`Enter only numbers.`);
      evt.target.reportValidity();
      evt.target.value = evt.target.value.replace(/\D/g, ``);
    } else if (!evt.target.value) {
      evt.target.setCustomValidity(`Enter price.`);
    } else {
      evt.target.setCustomValidity(``);
    }

    this.updateData({
      price: +evt.target.value
    }, true);
  }
}
