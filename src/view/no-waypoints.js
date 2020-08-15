import AbstractView from './abstract.js';

const createNoWaypointsTemplate = () => {
  return (
    `<p class="trip-events__msg">Click New Event to create your first point</p>`
  );
};

export default class NoWaypoints extends AbstractView {
  getTemplate() {
    return createNoWaypointsTemplate();
  }
}
