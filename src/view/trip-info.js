import AbstractView from './abstract.js';
import moment from 'moment';

const getMinAndMaxDate = (dates) => {
  if (dates.size) {
    let datesArr = [];

    for (let date of dates) {
      datesArr.push(new Date(date).getTime());
    }

    const minDate = Math.min(...datesArr);
    const maxDate = Math.max(...datesArr);

    const minDay = moment(minDate).format(`DD`);
    const maxDay = moment(maxDate).format(`DD`);

    const minMonth = moment(minDate).format(`MMM`);
    const maxMonth = moment(maxDate).format(`MMM`);


    if (minMonth === maxMonth) {
      return `${minMonth} ${minDay} &nbsp;&mdash;&nbsp; ${maxDay}`;
    }

    return `${minMonth} ${minDay} &nbsp;&mdash;&nbsp; ${maxMonth} ${maxDay}`;
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
