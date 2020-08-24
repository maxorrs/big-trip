import AbstractView from './abstract.js';
import {formatFullDateForAttr, formatDateForDayContainer} from '../utils/date.js';

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
  const fullDateForAttr = formatFullDateForAttr(date);
  const dateForDayContainer = formatDateForDayContainer(date);

  return (
    `<li class="trip-days__item  day" data-start-date="${date}">
    <div class="day__info">
      <span class="day__counter">${index}</span>
      <time class="day__date" datetime="${fullDateForAttr}">${dateForDayContainer}</time>
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
