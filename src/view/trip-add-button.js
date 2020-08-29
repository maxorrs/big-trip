import AbstractView from './abstract.js';

const createButtonNewEventTemplate = () => {
  return (
    `</nav><button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>`
  );
};

export default class TripAddButton extends AbstractView {
  getTemplate() {
    return createButtonNewEventTemplate();
  }
}
