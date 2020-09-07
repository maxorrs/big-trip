
import SmartView from './smart.js';
import {createPhoto, getDatalist, getBlankWaypoint, updateOffers, getConcatNameOffers} from '../utils/event.js';
import {formatDateForEditComponent} from '../utils/date.js';
import {types, getType, getOffers, getDestinationInfo} from '../utils/waypoint.js';
import {ucFirst} from '../utils/common.js';
import flatpickr from 'flatpickr';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const createControlsTemplate = (isFavorite, isNew, isDisabled, isSaving, isDeleting) => {
  return (
    `${isNew
      ?
      `<button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? `disabled` : ``}>${isSaving ? `Saving...` : `Save`}</button>
      <button class="event__reset-btn" type="reset">Cancel</button>`
      :
      `<button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? `disabled` : ``}>${isSaving ? `Saving...` : `Save`}</button>
      <button class="event__reset-btn" type="reset">${isDeleting ? `Deleting...` : `Delete`}</button>

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
    .values(types.transport)
    .map((activity) => {
      return (
        `<div class="event__type-item">
          <input id="event-type-${activity}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${activity}" ${data.type.toLowerCase() === activity ? `checked` : ``} ${data.isDisabled ? `disabled` : ``}>
          <label class="event__type-label  event__type-label--${activity}" for="event-type-${activity}-1">${ucFirst(activity)}</label>
        </div>`
      );
    })
  ).join(``);
};

const createTypeTransferTemplate = (data) => {
  return (Object.
    values(types.transfer)
    .map((transfer) => {
      const type = transfer === `check` ? `check-in` : transfer;
      return (
        `<div class="event__type-item">
          <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${data.type === transfer ? `checked` : ``} ${data.isDisabled ? `disabled` : ``}>
          <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${ucFirst(transfer)}</label>
        </div>`
      );
    })
  ).join(``);
};

const createOffers = (data) => {
  if (data) {
    return (Object
      .values(data.offers)
      .map((item) => {
        const nameForAttr = getConcatNameOffers(item.title);
        return (
          `<div class="event__offer-selector">
            <input class="event__offer-checkbox visually-hidden" id="${nameForAttr}-1" type="checkbox" name="${item.title}" ${item.isEnabled ? `checked` : ``} disaled=${item.isDisabled ? `true` : `false`}>
              <label class="event__offer-label" for="${nameForAttr}-1">
                <span class="event__offer-title">${item.title}</span>
                  &plus;
                  &euro;&nbsp;<span class="event__offer-price">${item.price}
                </span>
            </label>
          </div>`
        );
      }).join(``)
    );
  }

  return ``;
};

const createDestinationInfoTemplate = (data = {}) => {
  const {pictures, description} = data.destination;
  const photosTemplate = createPhoto(pictures);

  if (description && pictures) {
    return (
      `<section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>

        <p class="event__destination-description">
          ${description}
        </p>
        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${photosTemplate}
          </div>
        </div>
      </section>
    `);
  }

  return ``;
};

const createOffersTemplate = (data = {}) => {
  const offers = createOffers(data);
  if (offers) {
    return (
      `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
          ${offers}
        </div>
      </section>`
    );
  }

  return ``;
};

const createEventTemplate = (data = getBlankWaypoint(), isNewWaypoint, citiesDatalist = []) => {
  const {isFavorite, price, startDate, endDate, type, isDisabled, isSaving, isDeleting} = data;
  const city = data.destination.name;

  const startTimeValue = formatDateForEditComponent(startDate);
  const endTimeValue = formatDateForEditComponent(endDate);

  const typeForAttr = type === `сheck` ? `check-in` : type;

  const typeText = getType(type);
  const datalist = getDatalist(citiesDatalist);

  const destinationInfoTemplate = createDestinationInfoTemplate(data);
  const offertsTemplate = createOffersTemplate(data);
  const typeActivityTemplate = createTypeActivityTemplate(data);
  const typeTransferTemplate = createTypeTransferTemplate(data);
  const controlsTemplate = createControlsTemplate(isFavorite, isNewWaypoint, isDisabled, isSaving, isDeleting);

  const disabled = isDisabled ? `disabled` : ``;

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${typeForAttr}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${disabled}>

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Transfer</legend>
            ${typeActivityTemplate}
          </fieldset>

          <fieldset class="event__type-group">
            <legend class="visually-hidden">Activity</legend>
            ${typeTransferTemplate}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${typeText}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${city}" list="destination-list-1" placeholder="select destination..." required ${disabled}>
        <datalist id="destination-list-1">
          ${datalist}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">
          From
        </label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startTimeValue}" ${disabled}>
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">
          To
        </label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endTimeValue}" ${disabled}>
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}" required ${disabled}>
      </div>

      ${controlsTemplate}
      
    </header>
    
    <section class="event__details">
        ${offertsTemplate}
        ${destinationInfoTemplate}
    </section>
  </form>`
  );
};

export default class EditEvent extends SmartView {
  constructor(waypoint, isNewWaypoint = false, uniqueCitiesDatalist, offers, destinations) {
    super();
    this._data = EditEvent.parseWaypointToData(waypoint);
    this._startDatepicker = null;
    this._endDatepicker = null;
    this._isNewWaypoint = isNewWaypoint;
    this._uniqueCitiesDatalist = uniqueCitiesDatalist;
    this._offers = offers;
    this._destinatons = destinations;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._clickCloseHandler = this._clickCloseHandler.bind(this);
    this._favoriteHandler = this._favoriteHandler.bind(this);
    this._destinationInputHandler = this._destinationInputHandler.bind(this);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._clickDeleteHandler = this._clickDeleteHandler.bind(this);
    this._priceInputHandler = this._priceInputHandler.bind(this);
    this._offerChangeHandler = this._offerChangeHandler.bind(this);

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

    const startDate = formatDateForEditComponent(this._data.startDate);

    this._startDatepicker = flatpickr(
        this.getElement().querySelector(`#event-start-time-1`),
        {
          dateFormat: `d/m/y H:i`,
          enableTime: true,
          time24hr: true,
          defaultDate: startDate,
          onChange: this._startDateChangeHandler
        }
    );
  }

  _setEndDatepicker() {
    if (this._endDatepicker) {
      this._endDatepicker.destroy();
      this._endDatepicker = null;
    }
    const startDate = formatDateForEditComponent(this._data.startDate);
    const endDate = formatDateForEditComponent(this._data.endDate);


    this._endDatepicker = flatpickr(
        this.getElement().querySelector(`#event-end-time-1`),
        {
          dateFormat: `d/m/y H:i`,
          enableTime: true,
          time24hr: true,
          defaultDate: endDate,
          minDate: startDate,
          onChange: this._endDateChangeHandler
        }
    );
  }

  _startDateChangeHandler(selectedDates) {
    this.updateData({
      startDate: new Date(selectedDates[0]).toISOString()
    });
  }

  _endDateChangeHandler(selectedDates) {
    this.updateData({
      endDate: new Date(selectedDates[0]).toISOString()
    });
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
    this.updateData(EditEvent.parseWaypointToData(waypoint));
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
    const offers = this.getElement().querySelectorAll(`.event__offer-selector`);

    for (const offer of offers) {
      offer.addEventListener(`click`, this._offerChangeHandler);
    }

  }

  getTemplate() {
    return createEventTemplate(this._data, this._isNewWaypoint, this._uniqueCitiesDatalist);
  }

  _favoriteHandler(evt) {
    evt.preventDefault();
    this.updateData({
      isFavorite: !this._data.isFavorite
    });
  }

  _destinationInputHandler(evt) {
    evt.preventDefault();

    const uniqueCities = new Set(this._uniqueCitiesDatalist);
    const regExpDatalist = new RegExp(Array.from(uniqueCities).join(`$|`), `y`);

    if (!evt.target.value) {
      evt.target.setCustomValidity(`Select a destination from the list.`);
    } else if (!evt.target.value.match(regExpDatalist)) {
      evt.target.setCustomValidity(`The selected destination does not exist.`);
    } else {
      evt.target.setCustomValidity(``);
    }

    this.updateData({
      destination: getDestinationInfo(this._destinatons, evt.target.value)
    });
  }

  _typeChangeHandler(evt) {
    evt.preventDefault();

    this.updateData({
      type: evt.target.value,
      offers: getOffers(this._offers, evt.target.value),
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

  _offerChangeHandler(evt) {
    evt.preventDefault();

    let nameInput;

    if (evt.target.tagName === `LABEL`) {
      nameInput = evt.target.previousElementSibling.name;
    } else if (evt.target.tagName === `SPAN`) {
      nameInput = evt.target.parentElement.previousElementSibling.name;
    } else {
      return;
    }

    const allOffers = Object.values(this._data.offers);
    const newOffers = updateOffers(allOffers, nameInput);

    this.updateData({
      offers: newOffers
    });
  }
}
