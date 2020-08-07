import {nameMounth} from '../util.js';

const getMinAndMaxDate = (dates) => {
  let datesArr = [];
  for (let date of dates) {
    datesArr.push(new Date(date).getTime());
  }
  const min = new Date(Math.min(...datesArr)).toISOString();
  const minMounth = nameMounth[+min.substr(5, 2)];
  const minDate = min.substr(8, 2);

  const max = new Date(Math.max(...datesArr)).toISOString();
  const maxMounth = nameMounth[+max.substr(5, 2)];
  const maxDate = max.substr(8, 2);

  if (minMounth === maxMounth) {
    return `${minMounth} ${minDate} &nbsp;&mdash;&nbsp; ${maxDate}`;
  } else {
    return `${minMounth} ${minDate} &nbsp;&mdash;&nbsp; ${maxMounth} ${maxDate}`;
  }
};

const getRoute = (cities) => {
  let result = ``;
  for (const city of cities) {
    result += `${city} &mdash; `;
  }

  return result.slice(0, -9);
};

export const createTripInfoTemplate = (dates, cities, amount) => {
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
