import TripInfoView from '../view/trip-info.js';
import TripTabsView from '../view/trip-tabs.js';
import TripFiltersView from '../view/trip-filters.js';
import TripSortView from '../view/trip-sort.js';
import DaysView from '../view/days.js';
import OneDayView from '../view/one-day.js';
import NoWaypointsView from '../view/no-waypoints.js';
import NewWaypointPresenter from './new-waypoint.js';
import WaypointPresenter from './waypoint.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import {sortTime, sortPrice, getUniqueDates} from '../utils/waypoint.js';
import {SortType, UserAction, UpdateType, COUNT_WAYPOINTS} from '../consts.js';
import {filter} from '../utils/filter.js';

export default class Trip {
  constructor(tripContainer, waypointsModel, filterModel) {
    this._waypointsModel = waypointsModel;
    this._filterModel = filterModel;
    this._tripContainer = tripContainer;
    this._currenSortType = SortType.DEFAULT;
    this._waypointPresenter = {};

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._handleModeChange = this._handleModeChange.bind(this);

    this._tripTabsComponent = new TripTabsView();
    this._tripFiltersComponent = new TripFiltersView();
    this._tripDaysComponent = new DaysView();
    this._noWaypointsComponent = new NoWaypointsView();
    this._tripSortComponent = null;
    this._tripInfoComponent = null;

    this._tripMainContainer = this._tripContainer.querySelector(`.trip-main`);
    this._tripEventsContainer = this._tripContainer.querySelector(`.trip-events`);

    this._newWaypointPresenter = new NewWaypointPresenter(this._tripContainer, this._handleViewAction);
  }

  init() {
    this._renderTrip();
    this._waypointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  destroy() {
    this._clearTrip({resetSortType: true, tripEventsIsHidden: true});
    this._waypointsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  createFormNewWaypoint(callback) {
    this._newWaypointPresenter.init(callback);
  }

  destroyFormNewWaypoint() {
    this._newWaypointPresenter.destroy();
  }

  _renderDays() {
    render(this._tripEventsContainer, RenderPosition.BEFOREEND, this._tripDaysComponent);
  }

  _renderDay(uniqueDates) {
    if (this._currenSortType === SortType.DEFAULT) {
      let i = 1;
      for (let date of uniqueDates) {
        render(this._tripDaysComponent, RenderPosition.BEFOREEND, new OneDayView(i++, date));
      }
    } else {
      render(this._tripDaysComponent, RenderPosition.BEFOREEND, new OneDayView());
    }
  }

  _renderTrip() {
    const waypoints = this._getWaypoints();
    const waypointsCount = waypoints.length;
    const uniqueDates = getUniqueDates(waypoints);

    if (waypointsCount === 0) {
      this._renderNoWaypoints();
      return;
    }

    this._renderSort();
    this._renderDays();
    this._renderDay(uniqueDates);

    this._renderWaypoints(waypoints);
    this._tripEventsContainer.classList.remove(`trip-events--hidden`);
    if (this._tripContainer.querySelector(`.page-body__container--withoutAfter`)) {
      this._tripContainer.querySelector(`.page-body__container--withoutAfter`).className = `page-body__container`;
    }
  }

  _getWaypoints() {
    const filterType = this._filterModel.getFilter();
    const waypoints = this._waypointsModel.getWaypoints();
    const filteredWaypoints = filter[filterType](waypoints);

    switch (this._currenSortType) {
      case SortType.TIME:
        return filteredWaypoints.sort(sortTime);
      case SortType.PRICE:
        return filteredWaypoints.sort(sortPrice);
    }

    return filteredWaypoints;
  }

  _handleModeChange() {
    Object
      .values(this._waypointPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_WAYPOINT:
        this._waypointsModel.updateWaypoint(updateType, update);
        break;
      case UserAction.ADD_WAYPOINT:
        this._waypointsModel.addWaypoint(updateType, update);
        break;
      case UserAction.DELETE_WAYPOINT:
        this._waypointsModel.deleteWaypoint(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._waypointPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearTrip();
        this._renderTrip();
        break;
      case UpdateType.MAJOR:
        this.destroyFormNewWaypoint();
        this._clearTrip({resetSortType: true, tripEventsIsHidden: false});
        this._renderTrip();
        break;
    }
  }

  _renderInfo(uniqueDates, citiesForInfo, amount) {
    if (this._tripInfoComponent !== null) {
      this._tripInfoComponent = null;
    }
    this._tripInfoComponent = new TripInfoView(uniqueDates, citiesForInfo, amount);

    render(this._tripMainContainer, RenderPosition.AFTERBEGIN, this._tripInfoComponent);
  }

  _renderControls() {
    render(this._firstTitleTripControls, RenderPosition.AFTEREND, this._tripTabsComponent);
  }

  _renderNoWaypoints() {
    render(this._tripEventsContainer, RenderPosition.AFTERBEGIN, this._noWaypointsComponent);
  }

  _renderWaypoint(waypoint) {
    const waypointPresenter = new WaypointPresenter(this._tripDaysComponent, this._handleViewAction, this._handleModeChange);
    waypointPresenter.init(waypoint);
    this._waypointPresenter[waypoint.id] = waypointPresenter;
  }

  _clearTrip({resetSortType = false, tripEventsIsHidden = false} = {}) {
    Object
      .values(this._waypointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._waypointPresenter = {};

    if (COUNT_WAYPOINTS !== 0) {
      remove(this._tripSortComponent);
      remove(this._tripDaysComponent);
    }

    if (resetSortType) {
      this._currenSortType = SortType.DEFAULT;
    }


    if (tripEventsIsHidden) {
      this._tripEventsContainer.classList.add(`trip-events--hidden`);
    }

    if (this._tripContainer.querySelector(`.page-main .page-body__container`)) {
      this._tripContainer.querySelector(`.page-main .page-body__container`).className = `page-body__container--withoutAfter`;
    }
  }

  _clearWaypoints() {
    Object
      .values(this._waypointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._waypointPresenter = {};
  }

  _renderWaypoints(waypoints) {
    waypoints.forEach((waypoint) => this._renderWaypoint(waypoint));
  }

  _renderSort() {
    if (this._tripSortComponent !== null) {
      this._tripSortComponent = null;
    }

    this._tripSortComponent = new TripSortView(this._currenSortType);
    this._tripSortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._tripEventsContainer, RenderPosition.BEFOREEND, this._tripSortComponent);
  }

  _handleSortTypeChange(sortType) {
    if (this._currenSortType === sortType) {
      return;
    }

    this._currenSortType = sortType;

    this._clearTrip();
    this._renderTrip();
  }
}
