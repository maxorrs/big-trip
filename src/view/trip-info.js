import {NameMonth} from '../utils/waypoint.js';
import {PruningDate} from '../utils/date.js';
import AbstractView from './abstract.js';

const getMinAndMaxDate = (dates) => {
  if (dates.size) {
    let datesArr = [];

    for (let date of dates) {
      datesArr.push(new Date(date).getTime());
    }

    const min = new Date(Math.min(...datesArr)).toISOString();
    const minMonth = NameMonth[+min.substr(PruningDate.VALUE_FROM_MONTH, PruningDate.LENGTH_SHORT)];
    const minDate = min.substr(PruningDate.VALUE_FROM_DATE, PruningDate.LENGTH_SHORT);

    const max = new Date(Math.max(...datesArr)).toISOString();
    const maxMonth = NameMonth[+max.substr(PruningDate.VALUE_FROM_MONTH, PruningDate.LENGTH_SHORT)];
    const maxDate = max.substr(PruningDate.VALUE_FROM_DATE, PruningDate.LENGTH_SHORT);

    if (minMonth === maxMonth) {
      return `${minMonth} ${minDate} &nbsp;&mdash;&nbsp; ${maxDate}`;
    }

    return `${minMonth} ${minDate} &nbsp;&mdash;&nbsp; ${maxMonth} ${maxDate}`;
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
