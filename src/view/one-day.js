import {nameMounth} from '../util.js';

export const createOneDayTemplate = (index, date) => {
  const fullDate = new Date(date);

  const getNameDate = () => {
    const makingDate = new Date(fullDate).toISOString().substr(5, 5).split(`-`);
    const mounth = nameMounth[+makingDate[0]];
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
