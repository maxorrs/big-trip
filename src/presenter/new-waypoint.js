import WaypointEditView from '../view/edit-event.js';
import {generateId} from '../utils/common.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import {UserAction, UpdateType} from '../consts.js';
import {NewWaypointMode} from '../utils/waypoint.js';


export default class NewWaypoint {
  constructor(tripMainContainer, changeData) {
    this._tripMainContainer = tripMainContainer;
    this._changeData = changeData;

    this._newWaypointMode = NewWaypointMode.CLOSE;

    this._waypointEditView = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleClickDelete = this._handleClickDelete.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init() {
    if (this._waypointEditView !== null) {
      return;
    }

    this._waypointEditView = new WaypointEditView(true);
    this._waypointEditView.setFormSubmitHandler(this._handleFormSubmit);
    this._waypointEditView.setClickDeleteHandler(this._handleClickDelete);

    this._newWaypointMode = NewWaypointMode.OPEN;

    const container = this._tripMainContainer.querySelector(`.trip-days`);

    if (container) {
      render(container, RenderPosition.AFTEREND, this._waypointEditView);
    } else {
      const newContainer = this._tripMainContainer.querySelector(`.trip-events`);
      render(newContainer, RenderPosition.AFTERBEGIN, this._waypointEditView);
    }

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  destroy() {
    if (this._waypointEditView === null) {
      return;
    }
    this._newWaypointMode = NewWaypointMode.CLOSE;

    remove(this._waypointEditView);
    this._waypointEditView = null;

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _handleFormSubmit(waypoint) {
    this._changeData(
        UserAction.ADD_WAYPOINT,
        UpdateType.MINOR,
        Object.assign({id: generateId()}, waypoint)
    );

    this.destroy();
  }

  _handleClickDelete() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.ket === `Esc`) {
      evt.preventDefault();
      this.destroy();
    }
  }
}
