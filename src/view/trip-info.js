import AbstractView from './abstract.js';
import {getMinAndMaxDate} from '../utils/date.js';
import {getRoute} from '../utils/info.js';

const createTripInfoTemplate = (dates, cities, amount) => {
  const date = getMinAndMaxDate(dates);
  const citiesInfo = getRoute(cities);
  const finalAmount = amount;

  return (
    `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${citiesInfo}</h1>

      <p class="trip-info__dates">${date}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${finalAmount}</span>
    </p>
  </section>`
  );
};

export default class TripInfo extends AbstractView {
  constructor(dates, cities, amount) {
    super();
    this._dates = dates;
    this._cities = cities;
    this._amount = amount;
  }

  getTemplate() {
    return createTripInfoTemplate(this._dates, this._cities, this._amount);
  }
}
