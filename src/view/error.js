import AbstractView from './abstract.js';

const createErrorTemplate = () => {
  return (
    `<p class="trip-events__msg trip-events__msg--error">
      An error occurred while loading data. Try updating. :(  
    </p>`
  );
};

export default class Error extends AbstractView {
  getTemplate() {
    return createErrorTemplate();
  }
}
