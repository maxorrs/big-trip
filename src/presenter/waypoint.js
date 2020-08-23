import EditEventView from '../view/edit-event.js';
import WaypointView from '../view/waypoint.js';
import {PruningDate} from '../utils/date.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';

const THREE_HOURS_IN_MS = 10800000;

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export default class Waypoint {
  constructor(container, uniqueCitiesDatalist, changeData, changeMode) {
    this._container = container;
    this._waypointComponent = null;
    this._waypointEditComponent = null;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._mode = Mode.DEFAULT;

    this._uniqueCitiesDatalist = uniqueCitiesDatalist;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleFormReset = this._handleFormReset.bind(this);
    this._handleCloseClick = this._handleCloseClick.bind(this);
  }

  init(waypoint) {
    this._waypoint = waypoint;

    const prevWaypointEditComponent = this._waypointEditComponent;
    const prevWaypointComponent = this._waypointComponent;

    this._waypointEditComponent = new EditEventView(this._uniqueCitiesDatalist, waypoint);
    this._waypointComponent = new WaypointView(waypoint);

    const startTime = new Date(waypoint.time.startTime).getTime() + THREE_HOURS_IN_MS;
    const time = new Date(startTime).toISOString().substr(0, PruningDate.LENGTH_FULL_DATE);

    this._waypointComponent.setEditClickHandler(this._handleEditClick);

    this._waypointEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._waypointEditComponent.setFormResetHandler(this._handleFormReset);
    this._waypointEditComponent.setClickCloseHandler(this._handleCloseClick);

    const selector = this._container.getElement().querySelector(`[data-start-date="${time}"] > .trip-events__list`);

    if (prevWaypointEditComponent === null || prevWaypointComponent === null) {
      if (selector) {
        render(selector, RenderPosition.BEFOREEND, this._waypointComponent);
      } else {
        const oneDayContainer = this._container.getElement().querySelector(`.trip-events__list`);
        render(oneDayContainer, RenderPosition.BEFOREEND, this._waypointComponent);
      }

      return;
    }

    if (this._mode === Mode.EDITING) {
      replace(this._waypointEditComponent, prevWaypointEditComponent);
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._waypointComponent, prevWaypointComponent);
    }

    remove(prevWaypointEditComponent);
    remove(prevWaypointComponent);
  }

  destroy() {
    remove(this._waypointEditComponent);
    remove(this._waypointComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToCard();
    }
  }

  _replaceCardToForm() {
    replace(this._waypointEditComponent, this._waypointComponent);
    document.addEventListener(`keydown`, this._onEscKeyDown);
    this._changeMode();
    this._mode = Mode.EDITING;

  }

  _replaceFormToCard() {
    replace(this._waypointComponent, this._waypointEditComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._mode = Mode.DEFAULT;

  }

  _onEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._waypointEditComponent.reset(this._waypoint);
      this._replaceFormToCard();

      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  _handleEditClick() {
    this._replaceCardToForm();
  }

  _handleFormSubmit(waypointChange) {
    this._changeData(waypointChange);
    this._replaceFormToCard();
  }

  _handleFormReset() {
    this._waypointEditComponent.reset(this._waypoint);
    this._replaceFormToCard();
  }

  _handleCloseClick() {
    this._waypointEditComponent.reset(this._waypoint);
    this._replaceFormToCard();
  }
}
