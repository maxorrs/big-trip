import EditEventView from '../view/edit-event.js';
import WaypointView from '../view/waypoint.js';
import {formateDateForSelector} from '../utils/date.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {UserAction, UpdateType} from '../consts.js';

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export const State = {
  SAVING: `SAVING`,
  DELETING: `DELETING`,
  ABORTING: `ABORTING`
};

export default class Waypoint {
  constructor(container, changeData, changeMode, uniqueCitiesDatalist, offers, destinations, newWaypointPresenter) {
    this._container = container;
    this._waypointComponent = null;
    this._waypointEditComponent = null;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._mode = Mode.DEFAULT;
    this._uniqueCitiesDatalist = uniqueCitiesDatalist;
    this._offers = offers;
    this._destinations = destinations;
    this._newWaypointPresenter = newWaypointPresenter;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._handleCloseClick = this._handleCloseClick.bind(this);
  }

  init(waypoint) {
    this._waypoint = waypoint;

    const prevWaypointEditComponent = this._waypointEditComponent;
    const prevWaypointComponent = this._waypointComponent;
    this._waypointEditComponent = new EditEventView(waypoint, false, this._uniqueCitiesDatalist, this._offers, this._destinations);
    this._waypointComponent = new WaypointView(waypoint);

    const time = formateDateForSelector(waypoint.startDate);

    this._waypointComponent.setEditClickHandler(this._handleEditClick);
    this._waypointEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._waypointEditComponent.setClickDeleteHandler(this._handleDeleteClick);
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
      this._mode = Mode.DEFAULT;
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

  setViewState(state) {
    const resetFormState = () => {
      this._waypointEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    switch (state) {
      case State.SAVING:
        this._waypointEditComponent.updateData({
          isDisabled: true,
          isSaving: true
        });
        break;
      case State.DELETING:
        this._waypointEditComponent.updateData({
          isDisabled: true,
          isDeleting: true
        });
        break;
      case State.ABORTING:
        this._waypointComponent.shake(resetFormState);
        this._waypointEditComponent.shake(resetFormState);
        break;
    }
  }

  _replaceCardToForm() {
    replace(this._waypointEditComponent, this._waypointComponent);
    document.addEventListener(`keydown`, this._onEscKeyDown);
    this._changeMode();
    this._mode = Mode.EDITING;
    this._newWaypointPresenter.destroy();
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
    this._changeData(
        UserAction.UPDATE_WAYPOINT,
        UpdateType.MINOR,
        waypointChange
    );
  }

  _handleDeleteClick(waypoint) {
    this._changeData(
        UserAction.DELETE_WAYPOINT,
        UpdateType.MINOR,
        waypoint
    );
  }

  _handleCloseClick() {
    this._waypointEditComponent.reset(this._waypoint);
    this._replaceFormToCard();
  }
}
