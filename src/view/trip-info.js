import {NameMonth} from '../util.js';
import {createElement} from '../util.js';

const getMinAndMaxDate = (dates) => {
  if (!dates.size === 0) {
    let datesArr = [];
    for (let date of dates) {
      datesArr.push(new Date(date).getTime());
    }
    const min = new Date(Math.min(...datesArr)).toISOString();
    const minMounth = NameMonth[+min.substr(5, 2)];
    const minDate = min.substr(8, 2);

    const max = new Date(Math.max(...datesArr)).toISOString();
    const maxMounth = NameMonth[+max.substr(5, 2)];
    const maxDate = max.substr(8, 2);

    if (minMounth === maxMounth) {
      return `${minMounth} ${minDate} &nbsp;&mdash;&nbsp; ${maxDate}`;
    } else {
      return `${minMounth} ${minDate} &nbsp;&mdash;&nbsp; ${maxMounth} ${maxDate}`;
    }
  }

  return ``;

};

const getRoute = (cities = {}) => {
  let result = ``;
  for (const city of cities) {
    result += `${city} &mdash; `;
  }

  return result.slice(0, -9);
};

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

export default class TripInfo {
  constructor(dates, cities, amount) {
    this._element = null;
    this._dates = dates;
    this._cities = cities;
    this._amount = amount;
  }

  getTemplate() {
    return createTripInfoTemplate(this._dates, this._cities, this._amount);
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
