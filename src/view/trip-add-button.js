import AbstractView from './abstract.js';
import {MenuItem} from '../consts.js';


const createButtonNewEventTemplate = () => {
  return (
    `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button" data-menu-item="${MenuItem.ADD_WAYPOINT}">New event</button>`
  );
};

export default class TripAddButton extends AbstractView {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createButtonNewEventTemplate();
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    this._callback.menuClick(evt.target.dataset.menuItem);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(`click`, this._menuClickHandler);
  }

  setMenuItem() {
    const button = this.getElement();

    if (button.disabled) {
      button.disabled = false;
    } else {
      button.disabled = true;
    }
  }
}
