import AbstractView from './abstract.js';

const createDaysContainerTemplate = () => {
  return (
    `<ul class="trip-days"></ul>`
  );
};

export default class Days extends AbstractView {
  getTemplate() {
    return createDaysContainerTemplate();
  }
}
