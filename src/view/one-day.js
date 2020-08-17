import {NameMonth} from '../utils/waypoint.js';
import AbstractView from './abstract.js';

const createOneDayTemplate = (index, date) => {
  if (!index && !date) {
    return (
      `<li class="trip-days__item  day">
        <div class="day__info"></div>
        <ul class="trip-events__list">

        </ul>
      </li>
      `
    );
  }

  const fullDate = new Date(date).toISOString();

  const getNameDate = () => {
    const makingDate = new Date(fullDate).toISOString().substr(5, 5).split(`-`);
    const mounth = NameMonth[+makingDate[0]];
    const phrase = `${makingDate[1]} ${mounth}`;

    return phrase;
  };

  return (
    `<li class="trip-days__item  day" data-start-date="${date}">
    <div class="day__info">
      <span class="day__counter">${index}</span>
      <time class="day__date" datetime="${fullDate}">${getNameDate(date)}</time>
    </div>

    <ul class="trip-events__list">
      
    </ul>
  </li>`
  );
};

export default class OneDay extends AbstractView {
  constructor(index = ``, date = ``) {
    super();
    this._index = index;
    this._date = date;
  }

  getTemplate() {
    return createOneDayTemplate(this._index, this._date);
  }
}
