import {nameMonth} from '../util.js';
import {createElement} from '../util.js';

const createOneDayTemplate = (index, date) => {
  const fullDate = new Date(date);

  const getNameDate = () => {
    const makingDate = new Date(fullDate).toISOString().substr(5, 5).split(`-`);
    const mounth = nameMonth[+makingDate[0]];
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

export default class OneDay {
  constructor(index, date) {
    this._element = null;
    this._index = index;
    this._date = date;
  }

  getTemplate() {
    return createOneDayTemplate(this._index, this._date);
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
